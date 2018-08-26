'use strict';

// =================================================================================
// App Configuration
// =================================================================================

const {App} = require('jovo-framework');

const config = {
    logging: true,
};

const app = new App(config);

const CHINESE_CHARACTERS = [
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175759.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175801.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175808.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175809.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175811.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175815.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175816.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175819.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175820.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175823.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175827.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175828.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175830.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175834.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175837.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175840.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175843.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175846.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175848.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175850.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175855.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175857.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175900.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175902.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175907.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175910.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175912.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175913.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175914.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175917.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175920.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175922.jpg',
  'https://s3.amazonaws.com/chinese-flashcards/20180826_175923.jpg'
]

const CHINESE_ANSWERS = [
  'ben means stupid',
  'bi means finish',
  'biao means watch',
  'chen means morning',
  'cong means intelligence',
  'dai means wear',
  'fan means annoy',
  'gong means service',
  'hui means return',
  'ji means extremely',
  'ji means rank',
  'jing means pass',
  'kao means examine',
  'ke means class',
  'ke means guest',
  'le is the perfective suffix',
  'ma means hemp',
  'mang means busy',
  'qi means period',
  'qi means air',
  'shi means try',
  'wang means forget',
  'wei means for',
  'xiao means school',
  'xing means star',
  'ye means occupation',
  'yi means already',
  'yin means because',
  'ying means receive',
  'ying means shadow',
  'yong means use',
  'you means again',
  'zao means early',
]


// =================================================================================
// App Logic
// =================================================================================

app.setHandler({
    'LAUNCH': function() {
        let speech = this.speechBuilder()
                  .addText('Welcome to Chinese Flashcards.')
                  .addBreak('300ms')
                  .addText('Say, give me a flashcard, to test your chinese knowledge');

        let reprompt = this.speechBuilder()
                  .addText('Say, give me a flashcard, to test your chinese knowledge.');

        this.ask( speech , reprompt );
    },

    'FlashcardIntent': function() {

      let characterIndex = Math.floor( Math.random() * CHINESE_CHARACTERS.length )
      let chineseUrl = CHINESE_CHARACTERS[ characterIndex ];
      let pinyin = CHINESE_ANSWERS[ characterIndex ];

      let speech = this.speechBuilder()
                .addText( 'Here\'s your next challenge' )
                .addBreak( '300ms')
                .addText( 'Are you ready for the answer?' );

      let reprompt = this.speechBuilder()
                .addText( 'Are you ready for the answer?' );

      this.googleAction().showImageCard('Chinese Character', 'Simplified Lesson 13 Character', chineseUrl);
      this.setSessionAttribute( 'pinyin' , pinyin );
      this.followUpState('RevealAnswerState')
          .ask( speech , reprompt );
    },

    'RevealAnswerState' : {

      'YesNoIntent': function( yesno ) {

        const pinyin = this.getSessionAttribute( 'pinyin' );
        let speech = this.speechBuilder();
        let reprompt = this.speechBuilder();

        console.log(yesno);
        console.log(yesno.value);
        if ( yesno.value == "yes" ) {

          speech.addText( pinyin )
                .addBreak( '2000ms' )
                .addText( 'did you get it correct?' );
          reprompt.addText( 'did you get it correct?' );

          this.followUpState( 'FeedbackAnswerState' )
              .ask( speech , reprompt );

        } else {

          speech.addText( "Okay" )
                .addBreak( '300ms' )
                .addText( 'I will wait 10 more seconds...' )
                .addBreak( '10000ms' )
                .addText( ' Are you ready for the answer?' );
          reprompt.addText( ' Are you ready for the answer?' );

          this.followUpState( 'RevealAnswerState' )
              .ask( speech , reprompt );
        }

      },

    },

    'FeedbackAnswerState' : {

      'YesNoIntent': function( yesno ) {

        let speech = this.speechBuilder();
        let reprompt = this.speechBuilder();

        if ( yesno.value == "yes" ) {
          speech.addText("Congrats!")
                .addBreak( '300ms' )
                .addText( " Say give me a flashcard to hear another flashcard." );
          reprompt.addText("give me a flashcard to head another flashcard");
        } else {
          speech.addText("Practice makes perfect, say give me a flashcard to head another flashcard");
          reprompt.addText("give me a flashcard to head another flashcard");
        }

        this.ask( speech , reprompt );
      },

    },


});

module.exports.app = app;
