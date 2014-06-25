Template.newcourse.subjects = function(){
    return Subjects.find({},{sort:{'submittedOn':-1}});
};

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
