#para ejectuar el script con el csv L6 : Rscript main_helada.R 2018-06-03 124 21
#Funcion para procesar datos
procesamiento_datos <- function(datos, horas_evaluadas, frostModel, durationModel, intensityModel, hourModel){
  dia<-datos[datos$Fecha == Fecha,]
  if(nrow(dia) > 0){
    if(is.na(dia)[1] == FALSE){
      #print("Los datos del día son:")
      #print(dia)
      # Se obtienen los datos de las horas evaluadas
      bandera_horas<-TRUE
      for(i in 1:length(horas_evaluadas)){
        for(j in 1:nrow(dia)){
          if(horas_evaluadas[i] == dia$Hora[j]){
            if(bandera_horas == TRUE){
              dia_seccion_evaluada<-dia[j,]
              bandera_horas<-FALSE
            }else{
              dia_seccion_evaluada<-rbind(dia_seccion_evaluada, dia[j,])
            }
            break
          }
        }
      }
      #print("Las horas evaluadas del dia son: ")
      #print(horas_evaluadas)
      #print(dia_seccion_evaluada)
      if(nrow(dia_seccion_evaluada) == length(horas_evaluadas)){
        #Calculando punto de rocio
        for(i in 1:nrow(dia_seccion_evaluada)){
          if(i == 1){
            p.rocio<-((dia_seccion_evaluada$humedad[i] / 100)^(1/8)) * (112 + (0.9 * dia_seccion_evaluada$temperatura[i])) +(0.1 * dia_seccion_evaluada$temperatura[i]) - 112
          }else{
            p.rocio<-c(p.rocio, ((dia_seccion_evaluada$humedad[i] / 100)^(1/8)) * (112 + (0.9 * dia_seccion_evaluada$temperatura[i])) + (0.1 * dia_seccion_evaluada$temperatura[i]) - 112)
          }
        }

        #Otras variables del día
        humedad<-dia_seccion_evaluada$humedad
        temperatura<-dia_seccion_evaluada$temperatura
        vel.viento<-dia_seccion_evaluada$vel_viento
        dir.viento<-dia_seccion_evaluada$dir_viento
        rad.solar<-dia_seccion_evaluada$radiacion_solar
        #Datos día anterior
        dia_anterior<-datos[datos$Fecha == Fecha - 1,]

        if(nrow(dia_anterior) > 0){
          if(is.na(dia_anterior)[1] == FALSE){
            #print("Los datos del dia anterior son:")
            #print(dia_anterior)
            minima<-min(as.numeric(dia_anterior$temp_minima))
            maxima<-max(as.numeric(dia_anterior$temp_maxima))
            ejemplo<-c(humedad, temperatura, vel.viento, dir.viento, rad.solar, p.rocio, minima, maxima) # minima y maxima del dia anterior

            #print("La entrada al modelo es:")
            #print(ejemplo) ## muestra todas los atributos utilizados por el modelo
            #Realizar prediccion
            load(paste0(modelFilesPath, frostModel)) #utiliza el numero de la ema y el parametro[8] es la hora del dia de la prediccion (15,18,21 horas)
            prediccion<-predict(model_RF, ejemplo)
            if(as.numeric(prediccion[[1]][1]) == 1){
              salida <- list(
                'frost'     = TRUE
              )
            }else if(as.numeric(prediccion[[1]][1]) == 2){
              salida<-2
		          #print("No hay helada")
            }
          }else{
            #print("No hay datos del dia anterior")
            salida<-3
          }
        }else{
          #print("No hay datos del dia anterior")
          salida<-3
        }
      }else{
        #print("Cantidad de horas del dia insuficientes para hacer la prediccion")
        salida<-3
      }
    }else{
      #print("No hay datos del dia ")
      salida<-3
    }
  }else{
    #print("No hay datos del dia")
    salida<-3
  }
  # Se cambian las salidas con valores 2 (no hay helada) y 3 (no hay datos)
  # a formato de lista
  if(is.numeric(salida)){
    if(salida == 2){
      salida <- list(
        'frost'     = FALSE
      )
    }else if(salida == 3){
      salida <- list(
        'frost'     = NA
      )
    }
  }
  return(salida)
}

#Función principal para realizar las predicciones
prediccion_helada <- function(frostModel, durationModel, intensityModel, hourModel){
  #Horas que evaluan los modelos
  horas_evaluadas <- c((control_horas-9):(control_horas-1))

  #cat("La cantidad total de horas que se ocupan para entrenar el modelo son: ", length(horas_evaluadas), '\n')
  #cat("Las horas evaluadas para entrenar el modelo son: ", horas_evaluadas, '\n')
  datos<-read.csv(paste0(dataFilesPath, dataFile)) #lee un archivo csv como entrada, la fecha de evaluacion debe estar en este archivo

  #Conversion de datos
  datos$temperatura<-as.numeric(datos$temperatura)
  datos$precipitacion<-as.numeric(datos$precipitacion)
  datos$humedad<-as.numeric(datos$humedad)
  datos$presion<-as.numeric(datos$presion)
  datos$radiacion_solar<-as.numeric(datos$radiacion_solar)
  datos$temp_minima<-as.numeric(datos$temp_minima)
  datos$temp_maxima<-as.numeric(datos$temp_maxima)
  datos$vel_viento<-as.numeric(datos$vel_viento)
  datos$dir_viento<-as.numeric(datos$dir_viento)

  bandera<-TRUE
  for(i in 1:nrow(datos)){
    if(all(is.na(datos[i,2:ncol(datos)]))){
      if(bandera){
        indice_eliminar<-i
        bandera<-FALSE
      }else{
        indice_eliminar<-c(indice_eliminar, i)
      }
    }
  }
  if(exists("indice_eliminar")){
    datos<-datos[-indice_eliminar,]
    rm(indice_eliminar)
  }
  # En caso de na y nan
  if(nrow(datos) > 0){
    datos$temperatura[is.na(datos$temperatura)]<-0
    datos$precipitacion[is.na(datos$precipitacion)]<-0
    datos$humedad[is.na(datos$humedad)]<-0
    datos$presion[is.na(datos$presion)]<-0
    datos$radiacion_solar[is.na(datos$radiacion_solar)]<-0
    datos$temp_minima[is.na(datos$temp_minima)]<-0
    datos$temp_maxima[is.na(datos$temp_maxima)]<-0
    datos$vel_viento[is.na(datos$vel_viento)]<-0
    datos$dir_viento[is.na(datos$dir_viento)]<-0

    datos$temperatura[is.nan(datos$temperatura)]<-0
    datos$precipitacion[is.nan(datos$precipitacion)]<-0
    datos$humedad[is.nan(datos$humedad)]<-0
    datos$presion[is.nan(datos$presion)]<-0
    datos$radiacion_solar[is.nan(datos$radiacion_solar)]<-0
    datos$temp_minima[is.nan(datos$temp_minima)]<-0
    datos$temp_maxima[is.nan(datos$temp_maxima)]<-0
    datos$vel_viento[is.nan(datos$vel_viento)]<-0
    datos$dir_viento[is.nan(datos$dir_viento)]<-0

    #print("Los datos que se van a procesar son:")
    #print(datos)

    #Formato de fecha
    format<-"%Y-%m-%d"

    datos$Fecha<-as.Date(as.character(datos$Fecha.Hora), format)

    #cat("\nEl formato de procesamiento de las fechas es ", format, "\n\n")

    Horas<-strsplit(as.character(datos$Fecha.Hora), " ")

    #Guardamos las horas en un vector

    for(i in 1:length(Horas)){
      if(i == 1){
        vector_horas<-strsplit(Horas[[i]][2], ":")[[1]][1]
      }else{
        vector_horas<-c(vector_horas, strsplit(Horas[[i]][2], ":")[[1]][1])
      }
    }

    datos$Hora<-as.integer(vector_horas)

    #print("Procesamiento datos")
    #salida es el resultado de la prediccion
    # 1 Helada
    # 2 No helada
    # 3 sin datos
    salida <- procesamiento_datos(datos, horas_evaluadas, frostModel, durationModel, intensityModel, hourModel)
  }else{
   salida <- list(
     'frost'     = NA,
     'duration'  = NA,
     'intensity' = NA,
     'hour'      = NA
   )
  }
  return(salida)
}
