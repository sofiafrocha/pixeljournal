Notebooks = new Mongo.Collection('notebooks');
Sections = new Mongo.Collection('sections');
Notes = new Mongo.Collection('notes');

if (Meteor.isClient) {
    console.log("hello!");

    Template.register.events({
        'submit form': function(event) {
            event.preventDefault();
            console.log('signing you up!');
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();

            Accounts.createUser({
                email: email,
                password: password,
                name: name
            }, function(error) {
                if (error) {
                    console.log(error.reason);
                }
                else {
                    Router.go('notebooks');
                }
            });
            Router.go('home');
        }
    });

    Template.login.events({
        'submit form': function(event){
            event.preventDefault();
            var email = $('[name=email]').val();
            var password = $('[name=password]').val();

            Meteor.loginWithPassword(email, password, function(error) {

                if (error) {
                    console.log(error.reason);
                }
                else {
                    Router.go('notebooks');
                }
            });
        }
    });

    Template.navigation.events({
        'click .logout': function(event) {
            event.preventDefault();
            Meteor.logout();
            Router.go('login');
        }
    });

    Template.notes.helpers( {
        'note': function() {
            var currentSection = this._id;
            var currentUser = Meteor.userId();

            return Notes.find( { createdBy: currentUser, sectionId: currentSection }, {sort: {createdAt: -1}} );
        }
    });

    Template.sections.helpers({
        'section': function() {
            var currentNotebook = this._id;
            var currentUser = Meteor.userId();

            return Sections.find( { createdBy: currentUser, notebookId: currentNotebook }, {sort: {createdAt: -1} });
        }
    });

    Template.notebooks.helpers({
        'notebook': function() {
            var currentUser = Meteor.userId();
            console.log("currentUser: " + currentUser);

            return Notebooks.find({ createdBy: currentUser }, {sort: {createdAt: -1}} );
        }
    });

    Template.quickAddNote.events({
        // Add a quick note
        'submit form': function(event) {
            event.preventDefault();
            var currentSection = this._id;
            var noteContent = $('[name="noteContent"]').val();
            var noteName = noteContent;
            var currentUser = Meteor.userId();

            if (noteContent.length > 10) {
                noteName = noteContent.substring(0,10);
            }

            Notes.insert({
                name: noteName,
                content: noteContent,
                createdAt: new Date(),
                sectionId: currentSection,
                createdBy: currentUser
            })

            $('[name="noteContent"]').val('');
        }
    });

    Template.noteIndividual.events({
        // Delete a quick note
        'click .delete-note': function(event) {
            event.preventDefault();
            var documentId = this._id;
            var confirm = window.confirm("Delete this task?");

            if (confirm) {
                Notes.remove( { _id: documentId } );
            }
        },

        'keyup [name=noteIndividual]': function(event) {
            var noteIndividual = $(event.target).val();
            var documentId = this._id;

            Notes.update({ _id: documentId }, {$set: { content: noteIndividual }} );
        }
    });

    Template.addNotebook.events({
        'submit form': function(event) {
            event.preventDefault();
            var notebookTitle = $('[name=notebookTitle]').val();
            var currentUser = Meteor.userId();

            Notebooks.insert({
                title: notebookTitle,
                createdAt: new Date(),
                createdBy: currentUser
            }, function(error, results) {
                console.log(results);
                // Router.go('sections', { _id: results });
            });

            $('[name=notebookTitle]').val('');
        }
    });

    Template.addSection.events({
        'submit form': function(event) {
            event.preventDefault();
            var sectionTitle = $('[name="sectionTitle"]').val();
            var currentNotebook = this._id;
            var currentUser = Meteor.userId();

            Sections.insert({
                title: sectionTitle,
                createdAt: new Date(),
                notebookId: currentNotebook,
                createdBy: currentUser
            });

            $('[name=sectionTitle]').val('');
        }
    });
}
if (Meteor.isServer) {

}

// Routes
Router.configure({
    layoutTemplate: 'main'
});
Router.route('/', {
    name: 'home',
    template: 'home'
});
Router.route('/login', {
    name: 'login'
});
Router.route('/register', {
    name: 'register'
});
Router.route('/notebooks', {
    name: 'notebooks'
});
Router.route('/sections/:_id', {
    name: 'sections',
    template: 'sections',
    data: function() {
        var currentNotebook = this.params._id;
        return Notebooks.findOne({ _id: currentNotebook });
    }
});
Router.route('/notes/:_id', {
    name: 'notes',
    template: 'notes',
    data: function() {
        var currentSection = this.params._id;
        return Sections.findOne({ _id: currentSection });
    }
});
Router.route('/note/:_id', {
    name: 'note',
    template: 'note',
    data: function() {
        var currentNote = this.params._id;
        return Notes.findOne({ _id: currentNote });
    }
});
