import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'predictionTranslate',
  pure: false
})
export class PredictionTranslatePipe implements PipeTransform {
  items = [
    {value: "n", name: "Sin Probabilidad"},
    {value: false, name: "Sin Probabilidad"},
    {value: "y", name: "Probabilidad de Heladas"},
    {value: true, name: "Probabilidad de Heladas"},
    {value: undefined, name: "Sin Datos"},
    {value: 'null', name: "Sin Datos"},
    {value: "sd", name: "Sin Datos"},
  ];
  transform(str: string) {
    for (let itm of this.items) {
      if(itm.value == str) return itm.name;
    }
    return str;
  }
}
