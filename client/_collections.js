UserData = new Meteor.Collection("UserData");
Courses = new Meteor.Collection("courses");
Posts = new Meteor.Collection("posts");
Subjects = new Meteor.Collection("subjects");

Meteor.autorun(function funcAutoRunOnClient() {
    Meteor.subscribe('publicUserData', {});
    Meteor.subscribe('publicCourses', {});
    Meteor.subscribe('publicPosts', {});
    Meteor.subscribe('publicSubjects', {});
});
