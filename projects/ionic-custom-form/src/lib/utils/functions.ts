import { FormGroup, ValidationErrors } from '@angular/forms';

export const limparCaracteresDoNumero = (cpf: string) => {
  cpf = String(cpf);
  return cpf.replace(/\D+/g, '');
};

export function removeSpecialCharactersIfNoLetters(inputString: string) {
  if (!/[a-zA-Z]/.test(inputString)) {
    return inputString.replace(/[^\w\s]/gi, '');
  } else {
    return inputString;
  }
}
export function formatCnae(str: string) {
  // Verificar se a string possui o comprimento esperado
  if (str.length !== 7) {
    return str;
  }

  // Dividir a string em partes
  const parte1 = str.slice(0, 4);
  const parte2 = str.charAt(4);
  const parte3 = str.slice(5);

  // Formatar a string no formato desejado
  const resultado = `${parte1}-${parte2}/${parte3}`;
  return resultado;
}

export const validateCnpj = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) {
    return false;
  }

  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado !== Number(digitos.charAt(0))) {
    return false;
  }

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  return resultado === Number(digitos.charAt(1));
};

export const limparCaracteresEspeciaisCampos = <T>(
  obj: T,
  fields: Array<keyof typeof obj>
) => {
  fields.forEach((f) => {
    //@ts-expect-error
    obj[f] = limparCaracteresDoNumero(obj[f]);
  });
  return obj as T;
};

export function stringCurrentyToData(value: string) {
  return value.replace(/\./g, '').replace(',', '.');
}

export function formatCurrency(value: any): string {
  if (!value) return '';
  value = String(value);
  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) return '';

  return (numberValue / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatarTelefone(telefone: string) {
  // Remover todos os caracteres não numéricos
  if (!telefone) return '';
  const numeros = telefone.replace(/\D/g, '');

  // Verificar se o número de dígitos é válido para um telefone ou celular
  if (numeros.length === 10) {
    return `(${numeros.substring(0, 2)}) ${numeros.substring(
      2,
      6
    )}-${numeros.substring(6)}`;
  } else if (numeros.length === 11) {
    return `(${numeros.substring(0, 2)})${numeros.substring(
      2,
      3
    )} ${numeros.substring(3, 7)}-${numeros.substring(7)}`;
  } else {
    return telefone;
  }
}

export function formatarCPF(cpf: string) {
  // Remover todos os caracteres não numéricos
  const numeros = cpf.replace(/\D/g, '');

  // Verificar se o número de dígitos é válido para um CPF
  if (numeros.length !== 11) {
    return 'CPF inválido';
  }

  // Formatar o CPF
  return `${numeros.substring(0, 3)}.${numeros.substring(
    3,
    6
  )}.${numeros.substring(6, 9)}-${numeros.substring(9)}`;
}

export function formatarCNPJ(cnpj: string) {
  // Remover todos os caracteres não numéricos
  const numeros = cnpj.replace(/\D/g, '');

  // Verificar se o número de dígitos é válido para um CNPJ
  if (numeros.length !== 14) {
    return 'CNPJ inválido';
  }

  // Formatar o CNPJ
  return `${numeros.substring(0, 2)}.${numeros.substring(
    2,
    5
  )}.${numeros.substring(5, 8)}/${numeros.substring(8, 12)}-${numeros.substring(
    12
  )}`;
}

export function getFormValidationErrors(form: FormGroup) {
  Object.keys(form.controls).forEach((key) => {
    const controlErrors: ValidationErrors | null = form.get(key)!.errors;
    if (controlErrors != null) {
      Object.keys(controlErrors).forEach((keyError) => {
        console.log(
          'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
          controlErrors[keyError]
        );
      });
    }
  });
}

export function forceValidadeForm(form: FormGroup) {
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field)!;
    control.markAsTouched();
    control.updateValueAndValidity();
  });
}
