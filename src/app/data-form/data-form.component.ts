import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { EstadosBr } from '../shared/models/estadosbr';
import { DropdownService } from '../shared/services/dropdown.service';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup; // Variável que representa o formulário
  estados: EstadosBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService
    ) { }

  ngOnInit() {

    this.dropdownService.getEstadosBr()
      .subscribe(dados => {
        this.estados = dados;
        console.log(this.estados);
      });

    /*
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
      endereco: new FormGroup({
        cep: new FormControl(null),
        rua: new FormControl(null),
        ...
      })
    });*/

    this.formulario = this.formBuilder.group({
      nome: [null,
            [Validators.required, Validators.minLength(3),
              Validators.maxLength(10)]],
      email:  [null,
              [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
          cep:  [null,
                  [Validators.required, Validators.pattern("[0-9]{5}-[0-9]{3}")]],
          rua:  [null,
            [Validators.required]],
          numero:  [null,
              [Validators.required,Validators.min(0)]],
          complemento:  [null],
          bairro:  [null,
              [Validators.required]],
          cidade:  [null,
              [Validators.required]],
          estado:  [null,
              [Validators.required, Validators.maxLength(2)]]
      })
    });

  }

  /*
  get nome(){ return this.formulario.get('nome');}
  get email(){ return this.formulario.get('email');}
  */
  campo(campo: string) { return this.formulario.get(campo); }

  aplicaCssErro(campo: string) {
    const form: any = this.formulario.get(campo);

    return {
      'is-invalid': form.invalid && (form.touched || form.dirty)
    }
  }

  consultaCEP() {
    const cep = this.campo('endereco.cep').value;

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {

          if (!('erro' in dados)) {
            this.populaDadosForm(dados)
          } else {
            this.resetaDatosForm();
            alert('CEP não encontrado.');
          }
        });
    } else {
      this.resetaDatosForm();
      alert('CEP inválido.');
    }

  } // fim consultaCEP

  populaDadosForm(dados) {
     //Altera somente parte dos dados do formulário
     this.formulario.patchValue({
       endereco: {
         cep: dados.cep,
         numero: '',
         complemento: dados.complemento,
         rua: dados.logradouro,
         bairro: dados.bairro,
         cidade: dados.localidade,
         estado: dados.uf
       }
     });

     this.formulario.get('nome').setValue('Nome via setValue');
  }// fim populaDadosFormCEP

  resetaDatosForm() {
    this.formulario.patchValue({
      endereco: {
        cep: null,
        numero: null,
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  onSumit() {
    console.log(this.formulario);

    if (this.formulario.valid){
      // this.http.post('urlServer/formUsuario',JSON.stringify(this.formulario.value))
      this.http.post('https://httpbin.org/post',
                  JSON.stringify(this.formulario.value))
      .subscribe(dados => {
          // reseta o form
          // this.resetar();
          console.log(dados);
        },
        (error: any) => alert('erro')
      );
    } else {
      console.log('formulário inválido');
      this.verificaValidacoesFormulario(this.formulario);
    }
  }

  verificaValidacoesFormulario(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      // console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup){
        this.verificaValidacoesFormulario(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

}
