Notebooks = new Mongo.Collection('notebooks');
Sections = new Mongo.Collection('sections');
Notes = new Mongo.Collection('notes');

if (Meteor.isClient) {
    console.log("hello!");

    Template.notes.helpers( {
        'note': function() {
            return Notes.find( {}, {sort: {createdAt: -1}} );
        }
    });

    Template.sections.helpers({
        'section': function() {
            return Sections.find( {}, {sort: {name: 1}});
        }
    });

    Template.notebooks.helpers({
        'notebook': function() {
            return Notebooks.find( {}, {sort: {name: 1}});
        }
    });

    // Template.noteIndividual.helpers({
    //     'checked': function() {
    //         var isCompleted = this.completed;
    //     }
    // });

    Template.quickAddNote.events({
        // Add a quick note
        'submit form': function(event) {
            event.preventDefault();
            var noteContent = $('[name="noteContent"]').val();
            var noteName = noteContent;

            if (noteContent.length > 10) {
                noteName = noteContent.substring(0,10);
            }

            Notes.insert({
                name: noteName,
                content: noteContent,
                createdAt: new Date()
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

            Notebooks.insert({
                title: notebookTitle
            });

            $('[name=notebookTitle]').val('');
        }
    });

    Template.addSection.events({
        'submit form': function(event) {
            event.preventDefault();
            var sectionTitle = $('[name="sectionTitle"]').val();

            Sections.insert({
                title: sectionTitle
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
    template: 'home',
});
Router.route('/register', {
    name: 'register'
});
Router.route('/notebooks', {
    name: 'notebooks'
});
Router.route('/sections', {
    name: 'sections'
});
Router.route('/notes', {
    name: 'notes'
});
