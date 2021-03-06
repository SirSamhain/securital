import { Component, OnInit } from '@angular/core';
import { TwitterService } from '../services/twitter/twitter.service';
import { TypingDNAService } from '../services/typingDNA/typing-dna.service';

declare var TypingDNA: any;

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {
  tdna: any;
  tweetText: string;

  constructor(private twitterService: TwitterService, private typingDNAService: TypingDNAService) {}

  ngOnInit(): void {
  }

  verifyThenTweet() {
    if (!this.tdna) alert("You haven't typed anything yet!");
    let l = this.tweetText.length;
    let p = this.tdna.getTypingPattern({type:0, length:l});
    this.typingDNAService.auto(
      JSON.parse(localStorage.getItem("userAuth"))["screen_name"],
      p
    ).toPromise().then((r) => {
      if (r['result'] == 1) {
        let user = JSON.parse(localStorage.getItem("userAuth"));
        this.twitterService.postTweet(user["oauth_token"],user["oauth_token_secret"],user["user_id"],user["screen_name"],this.tweetText).toPromise()
      } else {
        alert("Typing Pattern does not match! Try typing out your tweet again.");
      }
      this.tdna.reset();
      this.tweetText = "";
    });
  }

  startRecording() {
    if (!this.tdna) {
      console.log("making new tdna");
      this.tdna = new TypingDNA();
    } else {
      console.log("starting recording");
      this.tdna.start();
    }
  }

  pauseRecording() {
    console.log("pausing recording");
    if (this.tdna) this.tdna.stop();
  }
}