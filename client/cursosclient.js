	UserData = new Meteor.Collection("UserData");
    Courses = new Meteor.Collection("courses");
    Posts = new Meteor.Collection("posts");
	Subjects = new Meteor.Collection("subjects");
	
	Template.favorites.courses = function(){
  		var elems = UserData.findOne({user:Meteor.user()._id});
  		if(elems)
  			return Courses.find({_id: {$in: elems.favs } });
  		else
  			return null;
	}

    Template.courselist.courses = function(){
    	return Courses.find({},{sort:{'submittedOn':-1}});
    }

	Template.newcourse.subjects = function(){
	    return Subjects.find({},{sort:{'submittedOn':-1}});
	};


	Template.datathread.isfav = function(){
		var thread = Session.get("currentThread");
		var user = UserData.findOne({user:Meteor.user()._id})
		if(user == null)
			return false;
		return user.favs.indexOf(thread) != -1;
	};

	Template.datathread.posts = function(){
		var thread = Courses.findOne({_id: Session.get("currentThread")});
		if(thread){
			var posts = Posts.find({_id:{"$in": thread.posts }},{sort:{'date':1}});
			return (posts)
		}
		return null;
	}

	Template.datathread.course = function(){
		var course = Courses.findOne({_id: Session.get("currentThread")});
		return course;
	}

	Template.newpost.currentThread = function(){
		return Session.get("currentThread");
	}

	Template.imageuser.url = function(){
		if(Meteor.user())
			return UsuarioHelper.getUser().imageUrl;
		return "";
	}

	Template.imageuser.screenName = function(){
		if(Meteor.user())
			return UsuarioHelper.getUser().name;
		return "unnamed"
	}

	Template.favorites.events({
		'click .cursos-item': function(event){
			if(this._id){
				Session.set("currentThread",this._id);
			} else {
				Session.set("currentThread", $(event.currentTarget).find(':selected').data("id"));
			}
		}
	})

	Template.courselist.events({
		'click .cursos-item': function(event){
			if(this._id){
				Session.set("currentThread",this._id);
			} else {
				Session.set("currentThread", $(event.currentTarget).find(':selected').data("id"));
			}
		}
	})

	Template.addsubject.events({
	    'click span.add-subject' : function(event){
	        event.preventDefault();
	        var subjectname = document.getElementById("subjectText").value;
	        Meteor.call("addSubject",subjectname,function(error , id){
	          console.log('Curso agregado con el id Id .. '+id);
	          console.log("Nueva materia. "+(error? "Error: " + error : "" ) + " - El id es: " + id);
	          document.getElementById("subjectText").value = subjectname;
	        });
	    },
	});

	Template.newcourse.events({
		'click span.add-course' : function(event){
	    	event.preventDefault();
	    	console.log("mellamo");
	    	var subjectname = document.getElementById("selectedSubject").value;
	    	var coursenumber = document.getElementById("courseNumber").value;
	    	Meteor.call("addCourse", {
	    		"date": new Date(), 
	    		"subjectName":subjectname,
	    		"number":coursenumber
	    		,"user":UsuarioHelper.getUser()}, 
	    		function(error,id){
	          		console.log("Nuevo curso. "+(error? "Error: " + error : "" ) + " - El id es: " + id);
	          		document.getElementById("courseNumber").value = "";
	        	}
	        );
	    }
	});


	Template.newpost.events({
		'click span.add-post' : function(event){
			var t = Session.get("currentThread");

			var data = {
						"thread":t,
						"text":$("#wrotepost").val(),
						"user":	UsuarioHelper.getUser(),
						"date" : new Date()
			};

			Meteor.call("addPost", data,
				function(error,id){
					console.log("Nuevo post. "+(error? "Error: " + error : "" ) + " - El id es: " + id);
					$("span.add-post").val("");
					document.getElementById("wrotepost").value = "";
				}
			)
		}
	})
	
	Template.datathread.events({
		'click .downvote' : function(event){
			Meteor.call("downvote",{post:this, user: Meteor.user()});
		},
		'click .upvote' : function(event){
			Meteor.call("upvote",{post:this, user: Meteor.user()});
		},
		'click .fav' : function(event){
			Meteor.call("fav", {course:$(".fav").data("course"), user: Meteor.user()._id});
		},
		'click .unfav' : function(event){
			Meteor.call("unfav", {course:$(".unfav").data("course"), user: Meteor.user()._id});
		}
	})
