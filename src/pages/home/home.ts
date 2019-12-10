import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  qrData = null;
  createdCode = null;
  scannedCode = null;
  translate: any;

  constructor(
    public toastController: ToastController,
    public navCtrl: NavController,
    public alert: AlertController,
    private barcodeScanner: BarcodeScanner) {

  }
 
  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        console.log('Error: ', err);
    });
  }

  async accept(){
    const toast = await this.toastController.create({
      message: 'Ticket is valid.',
      duration: 2000
    });
    toast.present();
    const alert = await this.alert.create({
      title: 'Confirm!',
      message: 'Message <strong></strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

}
