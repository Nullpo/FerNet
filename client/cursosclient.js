
	Subjects = new Meteor.Collection("subjects");
    Cursos = new Meteor.Collection("cursos");
    Posts = new Meteor.Collection("posts");
    UserData = new Meteor.Collection("UserData");

	Handlebars.registerHelper('i18ndatetime', function(fecha) {
    	return UsuarioHelper.getI18nDateTime(fecha);
  	});

	Handlebars.registerHelper('i18ndate', function(fecha) {
    	return UsuarioHelper.getI18nDate(fecha);
  	});

	Handlebars.registerHelper('i18ntime', function(fecha) {
    	return UsuarioHelper.getI18nTime(fecha);
  	});



  	Template.favorites.cursos = function(){
  		var elems = UserData.findOne({user:Meteor.user()._id});
  		if(elems)
  			return Cursos.find({_id: {$in: elems.favs } });
  		else
  			return null;
	}

    Template.listcursos.cursos = function(){
    	return Cursos.find({},{sort:{'submittedOn':-1}});
    }

	Template.newcurso.materias = function(){
	    return Subjects.find({},{sort:{'submittedOn':-1}});
	};

	Template.datathread.isfav = function(){
		var thread = Session.get("selectedThread");
		var user = UserData.findOne({user:Meteor.user()._id})
		if(user == null)
			return false;
		return user.favs.indexOf(thread) != -1;

		
	};

	Template.datathread.posts = function(){
		var thread = Cursos.findOne({_id: Session.get("selectedThread")});
		if(thread){
			var posts = Posts.find({_id:{"$in": thread.posts }},{sort:{'date':1}});
			return (posts)
		}
		return null;
	}

	Template.datathread.thread = function(){
		var thread = Cursos.findOne({_id: Session.get("selectedThread")});
		return thread;
	}

	

	Template.imageuser.url = function(){
		if(Meteor.user())
			return Meteor.user().services.twitter.profile_image_url;
		return "";
	}

	Template.imageuser.screenName = function(){
		if(Meteor.user())
			return Meteor.user().services.twitter.screenName;
		return "unnamed"
	}

	Template.favorites.events({
		'click .cursos-item': function(event){
			if(this._id){
				Session.set("selectedThread",this._id);
			} else {
				Session.set("selectedThread", $(event.currentTarget).find(':selected').data("id"));
			}
		}
	})

	Template.listcursos.events({
		'click .cursos-item': function(event){
			if(this._id){
				Session.set("selectedThread",this._id);
			} else {
				Session.set("selectedThread", $(event.currentTarget).find(':selected').data("id"));
			}
		}
	})


	Template.addmateria.events({
	    'click span.add-materia' : function(event){
	        event.preventDefault();
	        var nombremateria = document.getElementById("materiaText").value;
	        Meteor.call("addMateria",nombremateria,function(error , id){
	          console.log('Curso agregado con el id Id .. '+id);
	        });
	        document.getElementById("materiaText").value = "";
	    },
	});

	Template.newcurso.events({
		'click span.add-curso' : function(event){
	    	event.preventDefault();
	    	console.log("mellamo");
	    	var nombremateria = document.getElementById("materiaSeleccionada").value;
	    	var numerocurso = document.getElementById("numeroCurso").value;
	    	Meteor.call("addCurso", {
	    		"date": new Date(), 
	    		"nombre":nombremateria,
	    		"numero":numerocurso
	    		,"user":UsuarioHelper.getUser()}, 
	    		function(error,id){
	          		console.log('Curso agregado con el id Id .. '+id);
	          		$("#numeroCurso").value = "";
	        	}
	        );
	    }
	});


	Template.newpost.events({
		'click span.add-post' : function(event){
			var t = Session.get("selectedThread");

			var data = {
						"thread":t,
						"text":$("#wrotepost").val(),
						"user":	UsuarioHelper.getUser(),
						"date" : new Date()
			};

			Meteor.call("addPost", data,
				function(error,id){
					console.log("Nuevo post. Error: " + error + " - El id es: " + id);
					$("span.add-post").val("");
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
			Meteor.call("fav", {thread:$(".fav").data("thread"), user: Meteor.user()._id});
		},
		'click .unfav' : function(event){
			Meteor.call("unfav", {thread:$(".unfav").data("thread"), user: Meteor.user()._id});
		}
	})

	UsuarioHelper = {
		getUser : function(){
			return 	{
						"id" : Meteor.user()._id,
						"name": Meteor.user().profile.name,
						"imageUrl":Meteor.user().services.twitter.profile_image_url
					};
		},
		getI18nDateTime : function(fecha){
			return fecha.toLocaleString();
		},
		getI18nDate : function(fecha){
			return fecha.toLocaleString().split(" ")[0];
		},
		getI18nTime : function(fecha){
			return fecha.toLocaleString().split(" ")[1].substring(0,5);
		}
	}
