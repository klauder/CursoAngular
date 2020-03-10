import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null,
    cep: null,
    numero: null,
    complemento: null,
    rua: null,
    bairro: null,
    cidade: null,
    estado: null
  }

  constructor(
    private http: HttpClient,
    private cepService: ConsultaCepService
    ) { }

  ngOnInit() {
  }

  onSubmit(formulario){
    console.log(formulario);
    // console.log(this.usuario);
    // this.http.post('urlServer/formUsuario',JSON.stringify(formulario.value))
    // .subscribe(dados => console.log(dados));
    this.http.post('https://httpbin.org/post',
                JSON.stringify(formulario.value))
                .subscribe(dados => {
                    console.log(dados);
                    formulario.form.reset();
                },
                (error: any) => alert('erro post'));
  }

  // Aula 83
  aplicaCssErro(campo){
    return {
      'is-invalid': campo.invalid && (campo.touched || campo.dirty)
    }
  }

  consultaCEP(cep, form){
    // Nova variável cep somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => {

          if (!('erro' in dados)) {
            this.populaDadosForm(dados,form)
          } else {
            this.resetaDatosForm(form);
            alert('CEP não encontrado.');
          }
        });
    } else {
      this.resetaDatosForm(form);
      alert('CEP inválido.');
    }

  } // fim consultaCEP

  populaDadosForm(dados, formulario){
   /* //para Utilizar o setValue preciso setar todos os valores do formulário
    formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
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
*/
    // Alterar somente parte dos dados do formulário
    formulario.form.patchValue({
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

  } // fim populaDadosFormCEP

  resetaDatosForm(formulario){
    formulario.form.patchValue({
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
}
