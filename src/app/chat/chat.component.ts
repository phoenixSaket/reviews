import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ChatRequest, ChatResponse, GenerativeService, InitiateChatRequest, platform } from '../services/generative.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // for the apps dropdown
  private appNames: any[] = [];
  apps: any[] = [];
  
  currentApp: number = 0;
  totalApps: number = 0;

  // for selecting the app
  loading: boolean = false;
  shouldWait: boolean = true;
  selectedApp: any = {};
  isAppSelected: boolean = false;

  // promt variables
  message: string = "";
  content: string = "";

  // chat cutton to send message // when it should be disabled
  isButtonDisabled: boolean = true;
  history: any;

  // predefined prompts
  preDefinedPrompts: string[] = [
    "What can the AI chat tool do ?",
    "Summarize reviews",
    "Identify improvements",
    "Latest version reviews",
    "Identify issues"
  ];

  userPrompts: string[] = [];


  constructor(private data: DataService, private genrativeService: GenerativeService) { }

  ngOnInit(): void {
    this.totalApps = this.data.getTotalApps();

    this.data.loadedApps.subscribe((data: any) => {
      this.currentApp = data;
      if (data == this.totalApps) {
        this.shouldWait = false;
        this.appNames = (this.data.getAppName());
        this.appNames.forEach((appData: any) => {
          this.apps.push(appData);
        })
      }
    })

    this.loading = false;
  }

  appSelected(app: any) {
    this.loading = true;
    this.selectedApp = app.value;
    this.isAppSelected = true;

    let request: InitiateChatRequest = {
      id: app.value.id,
      platform: app.value.isIOS ? "ios": "android"
    }

    this.genrativeService.initiateChat(request).subscribe((response: ChatResponse) => {
      this.loading = false;
      if (response.opstatus == 0) {
        this.history = response.history;
      }
    })
  }

  /*
    @params -> event -> text event -> event.target.value
    changeInput : should handle the message to be sent
  */
  changeInput(event: any) {
    if (!this.isAppSelected) {
      this.isButtonDisabled = true;
      return;
    }

    if (event.key.toLowerCase() == "enter" && !this.isButtonDisabled) {
      this.sendMessage();
      return;
    }

    let value = event.target.value;
    if (value.length > 0) {
      this.message = value;
      this.isButtonDisabled = false;
    } else {
      this.message = "";
      this.isButtonDisabled = true;
    }
  }

  /*
    changeInput : should send the message
  */
  sendMessage() {
    this.loading = true;
    
    let request: ChatRequest = {
      message: this.message,
      history: this.history
    }
    this.genrativeService.chat(request).subscribe((response: ChatResponse) => {
      this.message = "";
      this.loading = false;
      this.history = response.history;
      setTimeout(() => {
        document.getElementById("messages").scrollTo(0, document.getElementById("messages").scrollHeight);
      }, 10);
    })
  }

  changePrompt(prompt: string) {
    let type = this.getType(prompt);
    this.message = type;    
    
    this.sendMessage();
  }

  getType(prompt: string): string {
    let r = "";
    switch (prompt) {
      case "Summarize reviews":
        r = "summarize all the reviews for me";
        break;
      case "Latest version reviews":
        r = "get me the reviews for the latest version based on the reviews provided";
        break;
      case "Identify improvements":
        r = "identify the improvements for me based on the reviews provided";
        break;
      case "Identify issues":
        r = "identify the issues for me based on the reviews provided";
        break;
      case "What can the AI chat tool do ?":
        r = "what can you do for me based on the reviews provided in general";
        break;
      default:
        r = prompt;
        break;
    }
    return r;
  }

}
