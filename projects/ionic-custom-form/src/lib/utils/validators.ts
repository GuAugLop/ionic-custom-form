import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { limparCaracteresDoNumero, validateCnpj } from './functions';
import moment from './moment';

export const customValidators = {
  cpf: (control: AbstractControl): { [key: string]: string } | null => {
    if (!control.value) return null;

    if (limparCaracteresDoNumero(control.value).length === 11) {
      const cleanCPF = String(control.value).replace(/\.|-|\s/g, '');

      const firstNineDigits = cleanCPF.substring(0, 9);

      const checker = cleanCPF.substring(9, 11);

      if (
        cleanCPF.length !== 11 ||
        cleanCPF === '00000000000' ||
        cleanCPF === '11111111111' ||
        cleanCPF === '22222222222' ||
        cleanCPF === '33333333333' ||
        cleanCPF === '44444444444' ||
        cleanCPF === '55555555555' ||
        cleanCPF === '66666666666' ||
        cleanCPF === '77777777777' ||
        cleanCPF === '88888888888' ||
        cleanCPF === '99999999999'
      ) {
        return { error: 'O CPF informado é inválido' };
      }

      const calcFirstChecker = (firstDigits: string): number => {
        let sum = 0;

        for (let j = 0; j < 9; ++j) {
          sum += Number(firstDigits.charAt(j)) * (10 - j);
        }

        const lastSumChecker = sum % 11;
        return lastSumChecker < 2 ? 0 : 11 - lastSumChecker;
      };

      const calcSecondChecker = (cpfWithChecker1: string): number => {
        let sum = 0;

        for (let k = 0; k < 10; ++k) {
          sum += Number(cpfWithChecker1.charAt(k)) * (11 - k);
        }

        const lastSumChecker2 = sum % 11;

        return lastSumChecker2 < 2 ? 0 : 11 - lastSumChecker2;
      };

      const checker1 = calcFirstChecker(firstNineDigits);

      const checker2 = calcSecondChecker(`${firstNineDigits}${checker1}`);

      return checker === `${checker1}${checker2}`
        ? null
        : { error: 'O CPF informado é inválido' };
    } else {
      return { error: '' };
    }
  },
  cnpj: (control: AbstractControl): { [key: string]: string } | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (value.length < 18) {
      return { error: '' };
    }
    // Validate CNPJ
    const cnpj = value.replace(/[^\d]+/g, '');
    if (!validateCnpj(cnpj)) {
      return { error: 'O CNPJ digitado é inválido' };
    }

    return null;
  },
  email: (control: AbstractControl): { [key: string]: string } | null => {
    if (!control.value) return null;
    if (
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(control.value)
    ) {
      return null;
    } else {
      return { error: 'E-mail inválido' };
    }
  },
  fullName: (control: AbstractControl): { [key: string]: string } | null => {
    if (!control.value) return null;
    const texto: string = control.value.trim();
    const split = texto.split(' ');
    for (let i = 0; i < split.length; i++) {
      if (!split[i].trim()) {
        return { error: 'O campo deve conter 2 ou mais nomes' };
      }
    }
    if (texto.split(' ').length < 2) {
      return { error: 'O campo deve conter 2 ou mais nomes' };
    }
    const check = texto.match(
      /[^a-zA-ZàáâãäåçèéêëìíîïñòóôõöùüúÿÀÁÂÃÄÅÇÈÉÊËÌÍÎÏÑÒÓÔÕÖOÙÜÚ ]/g
    );
    if (check) {
      return {
        error: 'Digite somente texto, sem números ou caracteres especiais',
      };
    } else {
      return null;
    }
  },
  compare: (controlName: string, matchingControlName: string) => {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ match: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  },
  strongPassword: (control: AbstractControl) => {
    const validates = {
      upperCase: true,
      lowerCase: true,
      number: true,
      especial: true,
    };
    if (!control.value) return validates;
    const regUpperCase = /.*[A-Z]+.*/;
    const regLowerCase = /.*[a-z]+.*/;
    const regNumber = /.*[0-9]+.*/;
    const regEsp = /.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+.*/;
    const regAll =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
    if (regAll.test(control.value)) return null;

    if (regUpperCase.test(control.value)) {
      validates.upperCase = false;
    }
    if (regLowerCase.test(control.value)) {
      validates.lowerCase = false;
    }
    if (regNumber.test(control.value)) {
      validates.number = false;
    }
    if (regEsp.test(control.value)) {
      validates.especial = false;
    }

    return validates;
  },
  currency: (control: AbstractControl) => {
    if (!control.value) return null;

    const pattern = /^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$/; // Regular expression for BRL currency format

    if (!pattern.test(control.value)) {
      return { error: '' };
    }

    return null;
  },

  phone: (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) return null;

    if (control.value && control.value.length < 14) return { error: '' };
    const telefonePattern = /^\(\d{2}\) \d{4}-\d{4}$/; // Padrão: quatro dígitos, hífen, quatro dígitos
    if (control.value && control.value.length < 9) return { error: '' };
    if (control.value && !telefonePattern.test(control.value)) {
      return { error: 'Número de telefone inválido' };
    }

    return null;
  },
  phoneWithoutDDD: (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    if (!control.value) return null;

    const telefonePattern = /^\d{4}-\d{4}$/; // Padrão: quatro dígitos, hífen, quatro dígitos
    if (control.value && control.value.length < 9) return { error: '' };

    if (control.value && !telefonePattern.test(control.value)) {
      return { error: 'Número de telefone inválido' };
    }

    return null;
  },
  cellphone: (control: AbstractControl): { [key: string]: string } | null => {
    if (!control.value) return null;
    if (control.value.length < 15) return { error: '' };

    // Expressão regular para validar celular com DDD e dígito 9
    const celularRegex = /^\(\d{2}\)9 \d{4}-\d{4}$/;

    if (!celularRegex.test(control.value)) {
      // Retorna um objeto com a chave 'celularInvalido' se o celular não for válido
      return { error: 'Número de celular inválido' };
    }

    return null;
  },
  cellPhoneWithoutDDD: (control: AbstractControl) => {
    if (!control.value) return null;
    const celularRegex = /^9 \d{4}-\d{4}$/;
    if (!celularRegex.test(control.value)) {
      return { error: 'Número de celular inválido' };
    }

    return null;
  },
  date: (min?: string, max?: string): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dataString = control.value;
      if (!dataString) return null;
      let dataMinima;
      let dataMaxima;
      if (min || max) {
        dataMinima = min && new Date(min + 'T01:00:00');
        dataMaxima = max && new Date(max + 'T01:00:00');
      }
      // Verifique se o valor é uma string
      if (typeof dataString !== 'string' || dataString.trim() === '') {
        return null; // Valor vazio ou não uma string é considerado válido.
      }

      // Remove a máscara para obter apenas os números.
      const partes = dataString.split('/');
      if (dataString.length < 10) {
        return {
          error: '',
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      const dia = parseInt(partes[0], 10);
      const mes = parseInt(partes[1], 10);
      const ano = parseInt(partes[2], 10);

      // Verifique se o dia, mês e ano são valores numéricos válidos.
      if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        return {
          error: 'Data inválida',
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      // Verifique se o mês está entre 1 e 12.
      if (mes < 1 || mes > 12) {
        return {
          error: 'Data inválida',
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      // Verifique se o dia está dentro dos limites do mês.
      const diasNoMes = new Date(ano, mes, 0).getDate();
      if (dia < 1 || dia > diasNoMes) {
        return {
          error: 'Data inválida',
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      // Construa uma data JavaScript e verifique se é válida.
      const data = new Date(ano, mes - 1, dia, 1);

      if (
        data.getDate() !== dia ||
        data.getMonth() !== mes - 1 ||
        data.getFullYear() !== ano
      ) {
        return {
          error: 'Data inválida',
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      // Verifique se a data está dentro do intervalo especificado (dataMinima e dataMaxima).
      if (dataMinima && data < dataMinima) {
        return {
          error: `Data não pode ser anterior a ${moment(dataMinima).format(
            'DD/MM/YYYY'
          )}`,
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      if (dataMaxima && data > dataMaxima) {
        return {
          error: `Data não pode ser posterior a ${moment(dataMaxima).format(
            'DD/MM/YYYY'
          )}`,
          min: min && min + 'T01:00:00',
          max: max && max + 'T01:00:00',
        };
      }

      return null; // A data é válida.
    };
  },
};
