import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  mediaUrl: string | null = null;
  mediaType = '';

  getMediaType(file: File) {
    if (!file) {
      return '';
    }

    const supportedVideoFormatRegex = /(\.3gp|\.mp4)$/i;
    const supportedImageFormatRegex = /(\.png|\.jpg|\.jpeg)$/i;

    if (supportedImageFormatRegex.exec(file.name)) {
      return 'image';
    }

    if (supportedVideoFormatRegex.exec(file.name)) {
      return 'video';
    }

    return '';
  }

  async getMediaUrl(file: File): Promise<string | null> {

    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onloadend = (e) => {
        const buffer = e.target?.result as ArrayBufferLike; // The file reader gives us an ArrayBuffer:
        const blob = new Blob([new Uint8Array(buffer)]); // We have to convert the buffer to a blob:

        const url = window.URL.createObjectURL(blob); // The blob gives us a URL
        const sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url) as string;

        resolve(sanitizedUrl);
      }

      fileReader.readAsArrayBuffer(file);
    })
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0]; // Get the file

    if (!file) {
      return;
    }

    this.mediaType = this.getMediaType(file);

    if (!this.mediaType) {
      alert('Invalid media file added');
      return;
    }

    this.mediaUrl = await this.getMediaUrl(file);
  }

}
