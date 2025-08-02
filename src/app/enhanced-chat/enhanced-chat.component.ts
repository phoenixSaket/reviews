import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { marked } from 'marked';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-enhanced-chat',
  templateUrl: './enhanced-chat.component.html',
  styleUrls: ['./enhanced-chat.component.css']
})
export class EnhancedChatComponent implements OnInit {

  @ViewChild('messageRef', { static: false }) messageRef: ElementRef | undefined;

  public chatForm: FormGroup;
  public chatHistory: { sender: string; message: string }[] = [];
  sessionId: string | null = null;
  public isLoading = false;

  public hasAppsBeenSelected: boolean = false;
  public allApps: { id: string, platform: string, isSelected: boolean }[] = JSON.parse(localStorage.getItem("apps-review")).map((el: { app: string, isIOS: boolean }) => {
    return { id: el.app, platform: el.isIOS ? "ios" : "android", isSelected: false };
  });

  private appsToAnalyze: { id: string, platform: string }[] = [];

  constructor(private chatService: ChatService, private fb: FormBuilder, private dataService: DataService) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.hasAppsBeenSelected = false;
  }

  startNewChatSession() {
    this.isLoading = true;
    this.chatHistory = []; // Clear old history
    this.chatService.initiateChatSession(this.appsToAnalyze).subscribe({
      next: (response) => {
        this.sessionId = response.sessionId;
        this.chatHistory.push({ sender: 'AI', message: response.initialMessage });
        this.isLoading = false;
        console.log('New chat session started:', this.sessionId);
      },
      error: (error) => {
        this.chatHistory.push({ sender: 'Error', message: 'Failed to start chat session.' });
        this.isLoading = false;
        console.error('API Error:', error);
      }
    });
  }

  sendMessage() {
    if (this.chatForm.invalid || !this.sessionId) return;
    const userMessage = this.chatForm.value.message;
    this.chatHistory.push({ sender: 'You', message: userMessage });
    this.chatForm.reset();
    this.isLoading = true;

    // Clear old AI response and show a placeholder
    const aiMessageIndex = this.chatHistory.findIndex(msg => msg.sender === 'AI' && msg.message === '[AI is typing...]');
    if (aiMessageIndex !== -1) {
      this.chatHistory[aiMessageIndex].message = '';
    } else {
      this.chatHistory.push({ sender: 'AI', message: '[AI is typing...]' });
    }

    this.chatService.sendChatMessage(this.sessionId, userMessage).subscribe({
      next: (chunk) => {
        // This is called for each streamed chunk
        if (chunk.type === 'text') {
          const lastMessage = this.chatHistory[this.chatHistory.length - 1];
          if (lastMessage && lastMessage.sender === 'AI' && lastMessage.message.includes('[AI is typing...]')) {
            // Replace placeholder with first chunk
            lastMessage.message = chunk.content;
          } else if (lastMessage && lastMessage.sender === 'AI') {
            // Append to the last message
            lastMessage.message += chunk.content; 
            lastMessage.message = this.convertMarkdown(lastMessage.message);
            
          } else {
            this.chatHistory.push({ sender: 'AI', message: marked(chunk.content, { async: false}) });
          }
        }
      },
      complete: () => {
        // This is called when the stream ends
        this.isLoading = false;
        console.log('AI response complete.');
      },
      error: (error) => {
        this.chatHistory.push({ sender: 'Error', message: `Chat stream error: ${error.message}` });
        this.isLoading = false;
        console.error('Stream Error:', error);
      }
    });
  }

  convertMarkdown(unformattedText: string) {
    let r: string = unformattedText; 
    
    try {
      // r = unformattedText.replace('\g\n', '<br>');

      // 1. Replace the beginning of the list (two newlines followed by '* ') with '<ul><li>'.
      // This starts the unordered list and the first list item.
      r = r.replace(/\n\n\*\s/g, '<ul><li>');

      // 2. Replace all subsequent list items (newline followed by '* ') with '</li><li>'.
      // This correctly separates the list items.
      r = r.replace(/\n\*\s/g, '</li><li>');
      
      // 3. Close the list correctly. We find the last list item and the two newlines
      // that separate the list from the final paragraph. We replace that with
      // '</li></ul>' to close the last item and the list, and then add break tags.
      r = r.replace(/\n\n/g, '</li></ul><br><br>');
      
      // 4. Finally, replace any remaining single newlines with a <br> tag for other
      // parts of the text that aren't a list.
      r = r.replace(/\n/g, '<br>');
      
      // Now, let's also handle the bolding markdown '**'
      // This replaces all `**` with `<strong>` and `</strong>` tags.
      r = r.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // This replaces all `*` with `<strong>` and `</strong>` tags,
      // making sure to not accidentally select the list item marker.
      r = r.replace(/\*(.*?)\*/g, '<strong>$1</strong>');

      // This replaces all `"` with `<i>` and `</i>` tags,
      // making sure to not accidentally select the list item marker.
      r = r.replace(/\"(.*?)\"/g, '<i>$1</i>');


    } catch (err: any) {
      console.log(err);
    }

    return r;
  }

  copy(): void {
    if (this.messageRef) {
      const textToCopy = this.messageRef.nativeElement.textContent || '';
      if (navigator.clipboard) {
        // Use the modern Clipboard API
        navigator.clipboard.writeText(textToCopy).then(() => {
          console.log('Text successfully copied to clipboard!');
        }).catch(err => {
          console.error('Could not copy text: ', err);
        });
      } else {
        // Fallback for older browsers
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = textToCopy;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        console.log('Text copied using fallback method!');
      }
    } else {
      console.error("Message reference is undefined. Cannot copy.");
    }
  }

  selectApp(app: { id: string, platform: string, isSelected: boolean }) {
    app.isSelected = !app.isSelected;
    this.appsToAnalyze = this.allApps.filter(app => app.isSelected);
  }

  initialize () {
    this.hasAppsBeenSelected = true;
    console.log(this.appsToAnalyze);
    if (this.appsToAnalyze.length > 0) {
      this.startNewChatSession();
    }
  }

  getAppName(id: string): string {
    let name = '';
    this.dataService.getAppName().forEach(appInner => {
      if (appInner.id == id) {
        name = appInner.appName;
      }
    })
    return name;
  }

}
