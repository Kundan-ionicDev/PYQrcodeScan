import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { ApiProvider } from '../../providers/api/api';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
// import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ticket: FormGroup;
  qrData = null;
  createdCode = null;
  scannedCode = null;
  translate: any;
  attendeedata: any;
  encodedData: any;
  
  constructor(
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public navCtrl: NavController,
    public alert: AlertController,
    public api : ApiProvider,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner) {
      this.ticket = this.formBuilder.group({
        ticketnumber: new FormControl('',[Validators.required])
      });
  }
 

  
  scanCode() {
    this.attendeedata = null;
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a QRCode inside the scan area',
      resultDisplayDuration: 500,
      disableSuccessBeep: false,
      orientation: 'portrait'
    };
   
    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scannedCode = JSON.parse(barcodeData.text);
      let params = {
        "userId": this.scannedCode[0].UserId,
        "bookingId": this.scannedCode[0].TicketId,
        "eventId": this.scannedCode[0].EventId
      };
  
      // alert('params:' + JSON.stringify(params));
      this.api._postAPI('event/check-in',params).subscribe(
          res  => {
            
            if(res.status == 200){
              this.attendeedata = res.data;
              this.toastCtrl.create({
                message: "This is valid ticket.",
                duration: 5000,
                position : 'middle',
                cssClass: 'toast-success',
                closeButtonText:'OK',
                showCloseButton:true,
              }).present();
              
              // console.log('this.attendeedata:', JSON.stringify(this.attendeedata));
            }else{
              // alert('Error');
              this.toastCtrl.create({
                message: res.message,
                // duration: 5000,
                position : 'middle',
                cssClass: 'toast-success',
                closeButtonText:'OK',
                showCloseButton:true,
              }).present();
              
            }
          },
          err => {
            if(err.length >0){
              alert('HTTP Error'+ err)
            }
          }
      );
    }, (err) => {
        console.log('Error: ', err);
    });

    // alert('this.scannedCode' + JSON.stringify(this.scannedCode));
   
    
  }

  manualCheckIn(){
    this.api._getAPI('event/booking?bookingId='+this.ticket.value.ticketnumber).subscribe(
        res  => {
          alert('HTTP response'+ JSON.stringify(res));
          if(res.status == 200){
            this.attendeedata = res.data;
            // this.attendeedata ={
            //   name:res.data[0].fk_eventbookings_user.name,
            //   emailid:res.data[0].fk_eventbookings_user.email,
            //   mobileNumber:'',
            //   docType:'',
            //   docId:'',
            //   status:res.data.isPresent // Present - Already checkin
            // };
          }else{
            alert('Error');
          }
        },
        err => {
          if(err.length >0){
            alert('HTTP Error'+ err)
          }
        }
    );
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
