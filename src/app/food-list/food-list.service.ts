import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Food {
  food: Item[];
}

export interface Item {
  name: string;
  cal: number;
}

export interface UpdateMsg {
  id: string;
  name: string;
  cals: number;
}

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  foodUrl = 'http://localhost:3000/api/cals';

  constructor(private http: HttpClient) { }


  //get json data
  getFood() {
    return this.http.get<Food>(this.foodUrl)
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }
  

  //get complete http response
  getFoodResponse(): Observable<HttpResponse<Food>> {
    return this.http.get<Food>(
      this.foodUrl, { observe: 'response' })
        .pipe(
          retry(3),
          catchError(this.handleError)
        );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}
