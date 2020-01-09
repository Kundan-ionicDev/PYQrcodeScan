import { Component } from '@angular/core';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  qrData = null;
  createdCode = null;
  scannedCode = null;

  constructor() {

  }

  createCode() {
    this.createdCode = this.qrData;
  }

}
