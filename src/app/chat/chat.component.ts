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
  public apps: any[] = [];
  
  public currentApp: number = 0;
  public totalApps: number = 0;

  // for selecting the app
  public loading: boolean = false;
  public shouldWait: boolean = true;

  // promt variables
  message: string = "";
  content: string = "";

  // chat cutton to send message // when it should be disabled
  isButtonDisabled: boolean = true;
  history: any;


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

    console.log(app.value);

    // this.selectedApp =  {
    //   "appName": "IBX",
    //   "isIOS": true,
    //   "id": "584785907"
    // }

    let request: InitiateChatRequest = {
      id: app.value.id,
      platform: app.value.isIOS ? platform.ios: platform.android
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
    let value = event.target.value;
    if (value.length > 0) {
      this.message = value.trim();
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
      this.loading = false;
      this.history = response.history;

      document.getElementById("messages").scrollTo(0, parseInt(document.getElementById("messages").style.height));
    })
  }

}
