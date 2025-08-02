// src/app/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AI } from './services';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  /**
   * Initiates a chat session and returns the session ID and initial message.
   * @param appData An array of app IDs and platforms.
   * @returns An Observable of the API response.
   */
  initiateChatSession(appData: any[]): Observable<any> {
    const payload = { apps: appData, promptType: 'SUMMARY' };
    return this.http.post<any>(AI.ai_chat, payload);
  }

  /**
   * Sends a message and streams the response from the chat API.
   * @param sessionId The active chat session ID.
   * @param message The user's message.
   * @returns An Observable of the streamed response chunks.
   */
  sendChatMessage(sessionId: string, message: string): Observable<any> {
    const subject = new Subject<any>();

    const payload = { sessionId, message };

    fetch(AI.chat_new, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(payload),
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(errorText => {
          throw new Error(errorText);
        });
      }
      return response.body.getReader();
    })
    .then(reader => {
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      function processText({ done, value }) {
        if (done) {
          subject.complete();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n\n')) !== -1) {
          const eventData = buffer.substring(0, newlineIndex);
          buffer = buffer.substring(newlineIndex + 2);
          if (eventData.startsWith('data: ')) {
            const jsonString = eventData.substring(6);
            try {
              const parsedData = JSON.parse(jsonString);
              subject.next(parsedData); // Push the parsed data to the subject
            } catch (e) {
              console.error('Error parsing streamed JSON:', e);
            }
          }
        }
        return reader.read().then(processText);
      }
      reader.read().then(processText);
    })
    .catch(error => {
      subject.error(error); // Push the error to the subject
    });

    return subject.asObservable();
  }
}