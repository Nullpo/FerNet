Template.favorites.courses = function(){
    var elems = UserData.findOne({user:Meteor.user()._id});
    if(elems)
        return Courses.find({_id: {$in: elems.favs } });
    else
        return null;
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
