Meteor.publish('publicUserData',function(){
    return UserData.find({});
});

Meteor.publish('publicCourses',function(){
    return Courses.find({});
});

Meteor.publish('publicPosts',function(){
    return Posts.find({});
});

Meteor.publish('publicSubjects',function(){
    return Subjects.find({});
});
