import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EstadosBr } from './../models/estadosbr';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr() {
    return this.http.get<EstadosBr[]>('assets/dados/estadosbr.json');
  }

}
