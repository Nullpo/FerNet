    Subjects = new Meteor.Collection("subjects");
    Courses = new Meteor.Collection("courses");
    Posts = new Meteor.Collection("posts");
    UserData = new Meteor.Collection("UserData");

    Meteor.startup(function() {
        return Meteor.methods({
          removeAllPosts: function() {
            return Courses.remove({});
          },
          removeAllSubjects: function() {
            return Subjects.remove({});
          },
          removeAllFavs: function() {
            return UserData.remove({});
          },
          removeAllposts: function() {
            return Posts.remove({});
          }
        });
    });

    Meteor.methods({
     addCourse: function(param) {
        var courseNumber = param.number;
        var subjectName = param.name;
        var postId = new Meteor.Collection.ObjectID();

        console.log("Generando el post  del usuario " + param.user);
        var postId = Posts.insert({
                "id": postId._str,
                "text": "Hilo para el curso: (" + param.number + ") " + param.name,
                "user": param.user,
                "date": param.date,
                "order":postId.getTimestamp(),
                "likes" : [],
                "dislikes" : []
        });
        console.log("Post generado (" + postId + ")")

        console.log("Generando el curso " + courseNumber + " de la materia " + subjectName );
        var courseId = Courses.insert({
            'number' : courseNumber,
            'name' : subjectName,
            'submittedOn': new Date(),
            'submittedBy' : Meteor.userId(),
            'posts': [postId] 
        });
        console.log("Curso generado (" + courseId + ")")

        return courseId;
     },
     addSubject: function(subjectName) {
        console.log("Generando la materia" + subjectName);
        var id = Subjects.insert({
            'name': subjectName
        });
        return id;
     },
     addPost: function(param){
        var postId = new Meteor.Collection.ObjectID();

        console.log("Generando el post del usuario " + param.user);
        console.log(TextFormatHelper.sanitize(param.text));
        var postId = Posts.insert({
                    "text":TextFormatHelper.sanitize(param.text), 
                    "user": param.user, 
                    "date":param.date,
                    "order": postId.getTimestamp(),
                    "likes" : [],
                    "dislikes" : []
                  });

        console.log("Post generado (" + postId + ")")
                        

        console.log("Actualizando el curso: " + param.thread  )
        var id = Courses.update(param.thread,{ $addToSet: {posts:postId} });
        console.log("Curso actualizado: " + id  )

        return id;
     },
     upvote: function(param){
        console.log("Upvote de " + param.user + " al post " + param.post )
        var id = Posts.update({_id:param.post._id},{$addToSet: {likes:param.user}});
        console.log("[OK] Upvote de " + param.user + " al post " + param.post )
        return id;
     },
     downvote: function(param){
        console.log("Upvote de " + param.user + " al post " + param.post )
        var id = Posts.update({_id:param.post._id},{$addToSet: {dislikes:param.user}});
        console.log("[OK] Upvote de " + param.user + " al post " + param.post )
        return id;
     },
     fav : function(param){
        var data = UserData.findOne({user:param.user});
        var resp = "";
        console.log("data 1: " + data);
        if (!data){
            console.log("Creando y guardando favorito de " + data + " thread:" + param.thread)
            resp = UserData.insert({user:param.user, favs:[param.thread]});
        } else {
            console.log("Guardando favorito de " + data + " thread:" + param.thread)
            resp = UserData.update({_id:data._id}, {$addToSet: {favs : param.thread}});
        }
        console.log("resp: " + resp);
        return;
     },
     unfav : function(param){
        var resp = UserData.update({user:param.user}, {$pull: {favs : param.thread}});
     }
    });

    TextFormatHelper = {
        regexUrl: /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi,
        sanitize: function(text){
            return text.replace("&","&amp;")
                .replace("<","&lt;")
                .replace(">","&gt;")
                .replace("'","&quot;")
                .replace("\"","&#x27;")
                .replace(/\n|\r|(\r\n)/g,"<br />")
                .replace(TextFormatHelper.regexUrl,function(match, p1){
                    if(!p1.startsWith("http://"))
                        p1 = "http://"+p1;
                    return "<a target='_blank' href='" + p1 + "'>" + p1 + "</a>"
                })
                //.replace(/\[b\](.*)\[\/b\]/,"<b>$1</b>")
        }
    }

    if (typeof String.prototype.startsWith != 'function') {
      // see below for better implementation!
      String.prototype.startsWith = function (str){
        return this.indexOf(str) == 0;
      };
    }