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
