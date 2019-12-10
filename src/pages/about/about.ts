import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  qrData = null;
  createdCode = null;
  scannedCode = null;
  data:any;
  constructor(
    public navCtrl: NavController, 
    private barcodeScanner: BarcodeScanner) {
      this.data =[
        { Name:"Kundan Sakpal", Seat: 3, InTime : "07:54 PM", Img:"assets/imgs/1.jpeg" },
        { Name:"Raja Dalvi", Seat: 4, InTime : "06:11 PM", Img:"assets/imgs/2.jpeg" },
        { Name:"Sanket Shinde", Seat: 1, InTime : "03:50 PM", Img:"assets/imgs/3.jpg" },
        { Name:"Rohit", Seat: 11, InTime : "06:00 PM", Img:"assets/imgs/1.jpeg" },
        { Name:"Jyoti Pone", Seat: 5, InTime : "07:00 PM", Img:"assets/imgs/4.jpeg" },
        { Name:"Joy terme", Seat: 1, InTime : "07:11 PM", Img:"assets/imgs/5.png" },
        { Name:"Vijay Pawar", Seat: 1, InTime : "07:12 PM", Img:"assets/imgs/3.jpg" },
        { Name:"Manoj mansharmani", Seat: 2, InTime : "07:44 PM", Img:"assets/imgs/6.png" },
        { Name:"Ketan Londe", Seat: 9, InTime : "08:01 PM", Img:"assets/imgs/4.jpeg" },
        { Name:"Yogesh ", Seat: 6, InTime : "09:54 PM", Img:"assets/imgs/1.jpeg" },
        { Name:"Nitin Macchar", Seat: 1, InTime : "07:54 PM", Img:"assets/imgs/6.png" },
      ];
      // console.log('data', JSON.stringify(this.data));
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        alert('Error: '+ JSON.stringify(err));
    });
  }

}
