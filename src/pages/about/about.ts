import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ApiProvider } from '../../providers/api/api';
import { catchError } from 'rxjs/operators';

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
    public api : ApiProvider,
    public navCtrl: NavController, 
    private barcodeScanner: BarcodeScanner) {
      this.initialize();
  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
    }, (err) => {
        alert('Error: '+ JSON.stringify(err));
    });
  }

  initialize(){
    this.api._getAPI('event/booking').subscribe(
      res  => {
        // alert('HTTP response'+ JSON.stringify(res));
        if(res.status ==200){
          this.data = res.data;
        }else{
          alert('Error');
        }
      },
      err => {
        if(err.length >0){
          // alert('HTTP Error'+ err)
        }
      }
  );
  }

}
