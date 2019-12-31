import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';

@Injectable()
export class ApiProvider {
  apiURL:string ="http://ramdeshdev.com/api/";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Authorization': 'Bearer ' + localStorage.getItem('access_token')
  })
};
  constructor(
    private http: HttpClient,
  ) {}

  // Calling POST Method's 
  _postAPI(methodname: string, params: any): Observable < any > {
    return this.http.post<any>(this.apiURL + methodname, params, this.httpOptions).pipe(
      tap(_ =>
        this.log(methodname)),
        catchError(
        this.handleError(methodname, [])
      )
    );
  }


  // Calling GET Method's
  _getAPI(methodname: string): Observable < any > {
    return this.http.get<any>(this.apiURL + methodname, this.httpOptions).pipe(
      tap(_ => this.log(methodname)),
      catchError(this.handleError('login', []))
    );
  }



  // Error Handling
  private handleError < T > (operation = 'operation', result ? : T) {
    return (error: any): Observable < T > => {
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a Service message with the MessageService */
  private log(message: string) {
    console.log(message);
  }
}
