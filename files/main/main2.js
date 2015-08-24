var debugFlag;
Template.TEMPLATE_NAME.rendered = function() {
	function setFullHeight() {
		if(!$(".CodeMirror").length) return;

		var viewHeight = $(window).height();
		var footerHeight = $("#footer").outerHeight();
		var codeTop = $(".CodeMirror").offset().top;

		var availableHeight = viewHeight - footerHeight - codeTop;
		if(availableHeight < 200) {
			availableHeight = 200;
		}

		$(".CodeMirror").height(availableHeight);
		$(".full-height").height(availableHeight);
	}

	// set full height on window resize
	$(window).resize(function() {
		setFullHeight();
	});

	// full height initialy
	setFullHeight();

	// initial text
	var fileContent = (this.data.params.fileId && this.data.file) ? this.data.file.content : "";
	Session.set("editorText", fileContent);
};

Template.TEMPLATE_NAME.events({
	"click .file-save": function(e, t) {
		var content = Session.get("editorText");
		COLLECTION_VAR.update({ _id: this.params.fileId }, { $set: { content: content } }, function(e, t) {
			if(e) {
				alert("Unable to save!\n\n" + e.message);
			}
		});
	},
	"click .tour": function(e, t) {
    // Define the tour!
	if (debugFlag) 
		console.log("Trying to start tour");
    var tour = {
      id: "hello-hopscotch",
      steps: [
        {
          title: "File name",
          content: "This is the current file being edited.",
          target: "tour1",
          placement: "bottom"
        },
        {
          title: "Save",
          content: "This is the 'save' button - don't forget to click it.",
          target: "tour2",
          placement: "left"
        },
        {
          title: "Back home",
          content: "Now you are back where you started.<BR> Thanks for taking our whistle-stop tour of this app.",
          target: "tour3",
          placement: "left",
		  yOffset: "-110",
		  arrowOffset: "100"
        }
      ]
    };

    // Start the tour!
	if (debugFlag) {
		console.log(tour);
		console.log("Calling tour bus");
	}
    hopscotch.startTour(tour);
	}
});

Template.TEMPLATE_NAME.helpers({
	"isFile": function() {
		return this.file && this.file.type === "item";
	},

	"editorOptions": function() {
		var options = {
			lineNumbers: true,
			keyMap: "sublime",
			theme: "blackboard",
			lint: false
		};

		if(this.file && this.file.filename) {
			var ext = this.file.filename.split('.').pop();
			switch(ext) {
				case "json": { options.mode = "application/ld+json"; options.lint = true; } break;
				case "js": { options.mode = "javascript"; options.lint = true; } break;
				case "html": { options.mode = "htmlmixed"; options.lint = false; } break;
				case "md": { options.mode = "markdown"; options.lint = false; } break;
			}
		}

		if(options.lint) options.gutters = ["CodeMirror-lint-markers"];

		return options;
	},
	"editorText": function() {
		return Session.get("editorText");
	}
});
