ObjectId = function (string) {
  return string
}
ISODate = function (string) {
  return string
}
let data = [
{ "_id" : ObjectId("5b7c257dec244402164ebea0"), "name" : "Tres Esquinas", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.698Z"), "location" : { "type" : "Point", "coordinates" : [ -71.21658325282624, -35.14349410278417 ] }, "public" : true, "stationData" : { "station" : { "id" : "83", "name" : "Tres Esquinas" }, "city" : { "id" : "133", "name" : "Molina" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.698Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea1"), "name" : "Lontué", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.698Z"), "location" : { "type" : "Point", "coordinates" : [ -71.24851226108149, -35.04573815523955 ] }, "public" : true, "stationData" : { "station" : { "id" : "92", "name" : "Lontué" }, "city" : { "id" : "133", "name" : "Molina" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.698Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea2"), "name" : "San Rafael", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.47686481563142, -35.30223743763137 ] }, "public" : true, "stationData" : { "station" : { "id" : "94", "name" : "San Rafael" }, "city" : { "id" : "126", "name" : "San Rafael" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea3"), "name" : "San Pedro", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.7720794712659, -35.33809391802134 ] }, "public" : true, "stationData" : { "station" : { "id" : "95", "name" : "San Pedro" }, "city" : { "id" : "123", "name" : "Pencahue" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea4"), "name" : "Colbún", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.45290374930482, -35.660643649881614 ] }, "public" : true, "stationData" : { "station" : { "id" : "98", "name" : "Colbún" }, "city" : { "id" : "140", "name" : "Colbún" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea5"), "name" : "Longaví Norte", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.68327331717592, -36.05367891084181 ] }, "public" : true, "stationData" : { "station" : { "id" : "100", "name" : "Longaví Norte" }, "city" : { "id" : "141", "name" : "Longaví" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea6"), "name" : "Longaví Sur", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.60671234305482, -35.95306687531456 ] }, "public" : true, "stationData" : { "station" : { "id" : "101", "name" : "Longaví Sur" }, "city" : { "id" : "141", "name" : "Longaví" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea7"), "name" : "San Javier", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.699Z"), "location" : { "type" : "Point", "coordinates" : [ -71.60456657453324, -35.6290469595826 ] }, "public" : true, "stationData" : { "station" : { "id" : "105", "name" : "San Javier" }, "city" : { "id" : "144", "name" : "San Javier" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.699Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebea8"), "name" : "Yerbas Buenas", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.700Z"), "location" : { "type" : "Point", "coordinates" : [ -71.57179355643166, -35.74299430137814 ] }, "public" : true, "stationData" : { "station" : { "id" : "97", "name" : "Yerbas Buenas" }, "city" : { "id" : "146", "name" : "Yerbas Buenas" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.700Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeaa"), "name" : "Parral", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.700Z"), "location" : { "type" : "Point", "coordinates" : [ -71.81502914987504, -36.147578481941316 ] }, "public" : true, "stationData" : { "station" : { "id" : "102", "name" : "Parral" }, "city" : { "id" : "142", "name" : "Parral" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.700Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeab"), "name" : "Parral Norte", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.700Z"), "location" : { "type" : "Point", "coordinates" : [ -71.80541611276567, -36.0710247963375 ] }, "public" : true, "stationData" : { "station" : { "id" : "103", "name" : "Parral Norte" }, "city" : { "id" : "143", "name" : "Retiro" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.700Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeac"), "name" : "Villa Alegre", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.700Z"), "location" : { "type" : "Point", "coordinates" : [ -71.72454072162509, -35.67905185135298 ] }, "public" : true, "stationData" : { "station" : { "id" : "104", "name" : "Villa Alegre" }, "city" : { "id" : "144", "name" : "San Javier" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.700Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebead"), "name" : "Cauquenes", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.701Z"), "location" : { "type" : "Point", "coordinates" : [ -72.31505585834384, -35.97745051612783 ] }, "public" : true, "stationData" : { "station" : { "id" : "164", "name" : "Cauquenes" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.701Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeae"), "name" : "Chanco", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.701Z"), "location" : { "type" : "Point", "coordinates" : [ -72.53593254368752, -35.73829183678985 ] }, "public" : true, "stationData" : { "station" : { "id" : "165", "name" : "Chanco" }, "city" : { "id" : "128", "name" : "Chanco" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.701Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeaf"), "name" : "Coronel de Maule", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.702Z"), "location" : { "type" : "Point", "coordinates" : [ -72.44680309435353, -36.03598216847789 ] }, "public" : true, "stationData" : { "station" : { "id" : "166", "name" : "Coronel de Maule" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.702Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb0"), "name" : "Los Despachos", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.702Z"), "location" : { "type" : "Point", "coordinates" : [ -72.31010056100786, -36.06602957339355 ] }, "public" : true, "stationData" : { "station" : { "id" : "167", "name" : "Los Despachos" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.702Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb1"), "name" : "Santa Sofía", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.702Z"), "location" : { "type" : "Point", "coordinates" : [ -72.35820722649805, -35.96531752639305 ] }, "public" : true, "stationData" : { "station" : { "id" : "168", "name" : "Santa Sofía" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.702Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb2"), "name" : "Sauzal", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.702Z"), "location" : { "type" : "Point", "coordinates" : [ -72.12142182514071, -35.729048629896404 ] }, "public" : true, "stationData" : { "station" : { "id" : "169", "name" : "Sauzal" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.702Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb3"), "name" : "Aresti", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.702Z"), "location" : { "type" : "Point", "coordinates" : [ -71.29976177355275, -35.14368125936277 ] }, "public" : true, "stationData" : { "station" : { "id" : "238", "name" : "Aresti" }, "city" : { "id" : "133", "name" : "Molina" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.702Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb4"), "name" : "Viñedos Puertas", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.703Z"), "location" : { "type" : "Point", "coordinates" : [ -71.26886272570118, -34.97801759202874 ] }, "public" : true, "stationData" : { "station" : { "id" : "239", "name" : "Viñedos Puertas" }, "city" : { "id" : "130", "name" : "Curicó" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.703Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb5"), "name" : "Casas Patronales", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.703Z"), "location" : { "type" : "Point", "coordinates" : [ -71.43949413177324, -35.49524480552069 ] }, "public" : true, "stationData" : { "station" : { "id" : "240", "name" : "Casas Patronales" }, "city" : { "id" : "125", "name" : "San Clemente" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.703Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb6"), "name" : "J. bouchon", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.704Z"), "location" : { "type" : "Point", "coordinates" : [ -71.9887826393824, -35.5743102737041 ] }, "public" : true, "stationData" : { "station" : { "id" : "241", "name" : "J. bouchon" }, "city" : { "id" : "144", "name" : "San Javier" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.704Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb7"), "name" : "Torres", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.704Z"), "location" : { "type" : "Point", "coordinates" : [ -72.28703963774024, -35.570761449884984 ] }, "public" : true, "stationData" : { "station" : { "id" : "242", "name" : "Torres" }, "city" : { "id" : "144", "name" : "San Javier" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.704Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb8"), "name" : "Odjfell", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.704Z"), "location" : { "type" : "Point", "coordinates" : [ -72.26676749938633, -36.14517575565843 ] }, "public" : true, "stationData" : { "station" : { "id" : "244", "name" : "Odjfell" }, "city" : { "id" : "127", "name" : "Cauquenes" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.704Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeb9"), "name" : "San Pedro - Molina", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.704Z"), "location" : { "type" : "Point", "coordinates" : [ -71.32208812254248, -35.09270536588755 ] }, "public" : true, "stationData" : { "station" : { "id" : "252", "name" : "San Pedro - Molina" }, "city" : { "id" : "133", "name" : "Molina" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.704Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeba"), "name" : "San Pedro - Pencahue", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.705Z"), "location" : { "type" : "Point", "coordinates" : [ -71.77989864489064, -35.345421993259095 ] }, "public" : true, "stationData" : { "station" : { "id" : "253", "name" : "San Pedro - Pencahue" }, "city" : { "id" : "123", "name" : "Pencahue" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.705Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebebb"), "name" : "El Aromo", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.705Z"), "location" : { "type" : "Point", "coordinates" : [ -71.60400366818067, -35.53762180815807 ] }, "public" : true, "stationData" : { "station" : { "id" : "254", "name" : "El Aromo" }, "city" : { "id" : "350", "name" : "Duao" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.705Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebebc"), "name" : "Miraflores", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.708Z"), "location" : { "type" : "Point", "coordinates" : [ -71.78434324203408, -35.80497118720232 ] }, "public" : true, "stationData" : { "station" : { "id" : "628", "name" : "Miraflores" }, "city" : { "id" : "141", "name" : "Longaví" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.708Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebebd"), "name" : "Rarin", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.705Z"), "location" : { "type" : "Point", "coordinates" : [ -71.95949363987893, -34.76527887645878 ] }, "public" : true, "stationData" : { "station" : { "id" : "293", "name" : "Rarin" }, "city" : { "id" : "138", "name" : "Vichuquén" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.705Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebebe"), "name" : "General Freire, Curicó Ad.", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.705Z"), "location" : { "type" : "Point", "coordinates" : [ -71.21562910018838, -34.96548665309692 ] }, "public" : true, "stationData" : { "station" : { "id" : "305", "name" : "General Freire, Curicó Ad." }, "city" : { "id" : "130", "name" : "Curicó" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.705Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebebf"), "name" : "Santa Amada", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.706Z"), "location" : { "type" : "Point", "coordinates" : [ -71.50390434544533, -35.74497970303247 ] }, "public" : true, "stationData" : { "station" : { "id" : "311", "name" : "Santa Amada" }, "city" : { "id" : "139", "name" : "Linares" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.706Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec0"), "name" : "San Clemente", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.706Z"), "location" : { "type" : "Point", "coordinates" : [ -71.57462883275002, -35.52873374916812 ] }, "public" : true, "stationData" : { "station" : { "id" : "312", "name" : "San Clemente" }, "city" : { "id" : "125", "name" : "San Clemente" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.706Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec1"), "name" : "Monte Flor - Tucapel", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.706Z"), "location" : { "type" : "Point", "coordinates" : [ -71.9339461333584, -36.244100127827345 ] }, "public" : true, "stationData" : { "station" : { "id" : "368", "name" : "Monte Flor - Tucapel" }, "city" : { "id" : "142", "name" : "Parral" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.706Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec2"), "name" : "Campanacura", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.706Z"), "location" : { "type" : "Point", "coordinates" : [ -72.03224084805697, -35.954734372622575 ] }, "public" : true, "stationData" : { "station" : { "id" : "403", "name" : "Campanacura" }, "city" : { "id" : "142", "name" : "Parral" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.706Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec3"), "name" : "Las Lomillas - San Clemente", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.706Z"), "location" : { "type" : "Point", "coordinates" : [ -71.31364774642861, -35.53875675461204 ] }, "public" : true, "stationData" : { "station" : { "id" : "408", "name" : "Las Lomillas - San Clemente" }, "city" : { "id" : "125", "name" : "San Clemente" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.706Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec4"), "name" : "Vichuquén", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.707Z"), "location" : { "type" : "Point", "coordinates" : [ -72.03056144993752, -34.85001590610329 ] }, "public" : true, "stationData" : { "station" : { "id" : "413", "name" : "Vichuquén" }, "city" : { "id" : "138", "name" : "Vichuquén" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.707Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec5"), "name" : "San Jorge - Los Niches", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.707Z"), "location" : { "type" : "Point", "coordinates" : [ -71.13757896178868, -35.048970468127806 ] }, "public" : true, "stationData" : { "station" : { "id" : "491", "name" : "San Jorge - Los Niches" }, "city" : { "id" : "130", "name" : "Curicó" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.707Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec6"), "name" : "Lien", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.707Z"), "location" : { "type" : "Point", "coordinates" : [ -71.9671812071465, -35.10003807663443 ] }, "public" : true, "stationData" : { "station" : { "id" : "495", "name" : "Lien" }, "city" : { "id" : "119", "name" : "Curepto" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.707Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec7"), "name" : "Lomas", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.707Z"), "location" : { "type" : "Point", "coordinates" : [ -72.60765784987598, -35.82650380229616 ] }, "public" : true, "stationData" : { "station" : { "id" : "503", "name" : "Lomas" }, "city" : { "id" : "129", "name" : "Pelluhue" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.707Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec8"), "name" : "Via Wines", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.707Z"), "location" : { "type" : "Point", "coordinates" : [ -71.18131542345509, -35.08402581541721 ] }, "public" : true, "stationData" : { "station" : { "id" : "592", "name" : "Via Wines" }, "city" : { "id" : "130", "name" : "Curicó" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.707Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebec9"), "name" : "Laberinto", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.708Z"), "location" : { "type" : "Point", "coordinates" : [ -71.28631210885942, -35.692158133974026 ] }, "public" : true, "stationData" : { "station" : { "id" : "597", "name" : "Laberinto" }, "city" : { "id" : "140", "name" : "Colbún" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.708Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebeca"), "name" : "Concha y Toro - Pencahue", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.708Z"), "location" : { "type" : "Point", "coordinates" : [ -71.83397769927979, -35.44081297839513 ] }, "public" : true, "stationData" : { "station" : { "id" : "625", "name" : "Concha y Toro - Pencahue" }, "city" : { "id" : "123", "name" : "Pencahue" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.708Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebecb"), "name" : "Yerbas Buenas 2", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.708Z"), "location" : { "type" : "Point", "coordinates" : [ -71.54043102142168, -35.690136560619464 ] }, "public" : true, "stationData" : { "station" : { "id" : "84", "name" : "Yerbas Buenas 2" }, "city" : { "id" : "146", "name" : "Yerbas Buenas" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.708Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebecc"), "name" : "Morza Norte Ex Peteroa", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.709Z"), "location" : { "type" : "Point", "coordinates" : [ -71.0199537264998, -34.83414256537418 ] }, "public" : true, "stationData" : { "station" : { "id" : "86", "name" : "Morza Norte Ex Peteroa" }, "city" : { "id" : "137", "name" : "Teno" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.709Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebecd"), "name" : "Morza", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.709Z"), "location" : { "type" : "Point", "coordinates" : [ -71.02019262252725, -34.851518547253974 ] }, "public" : true, "stationData" : { "station" : { "id" : "88", "name" : "Morza" }, "city" : { "id" : "137", "name" : "Teno" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.709Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebece"), "name" : "Teno", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.709Z"), "location" : { "type" : "Point", "coordinates" : [ -71.16525399669626, -34.8788107996332 ] }, "public" : true, "stationData" : { "station" : { "id" : "89", "name" : "Teno" }, "city" : { "id" : "137", "name" : "Teno" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.709Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebecf"), "name" : "Sagrada Familia", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.709Z"), "location" : { "type" : "Point", "coordinates" : [ -71.34277796780225, -34.99542173475027 ] }, "public" : true, "stationData" : { "station" : { "id" : "90", "name" : "Sagrada Familia" }, "city" : { "id" : "136", "name" : "Sagrada Familia" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.709Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebed0"), "name" : "Rauco", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.709Z"), "location" : { "type" : "Point", "coordinates" : [ -71.3172111462336, -34.924504510153184 ] }, "public" : true, "stationData" : { "station" : { "id" : "91", "name" : "Rauco" }, "city" : { "id" : "134", "name" : "Rauco" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.709Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebed1"), "name" : "Maule", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.710Z"), "location" : { "type" : "Point", "coordinates" : [ -71.68016338488087, -35.57545051905912 ] }, "public" : true, "stationData" : { "station" : { "id" : "93", "name" : "Maule" }, "city" : { "id" : "144", "name" : "San Javier" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.710Z") },
{ "_id" : ObjectId("5b7c257dec244402164ebed2"), "name" : "Linares 2", "type" : "agromet", "__v" : 0, "createdAt" : ISODate("2018-08-21T14:45:17.710Z"), "location" : { "type" : "Point", "coordinates" : [ -71.58435773919336, -35.919883310864776 ] }, "public" : true, "stationData" : { "station" : { "id" : "99", "name" : "Linares 2" }, "city" : { "id" : "141", "name" : "Longaví" }, "region" : { "id" : "9", "name" : "Maule" }, "settings" : { "autobackup" : true } }, "updatedAt" : ISODate("2018-08-21T14:45:17.710Z") }
]

require('../api/models/db')
const mongoose = require('mongoose')
const AgrometStation = mongoose.model('AgrometStation')

let documents = []
data.forEach(item => {
  let document = {
    name: item.name,
    station: item.stationData.station,
    region: item.stationData.region,
    city: item.stationData.city,
    settings: {
      autobackup: true,
      public: true
    },
    updatedAt: new Date(),
    createdAt: new Date(),
    location: item.location
  }
  document.station.id = +document.station.id
  document.region.id  = +document.region.id
  document.city.id    = +document.city.id
  documents.push(document)
})

insertData = async () => {
  let bulkOp = AgrometStation.collection.initializeOrderedBulkOp();
  documents.forEach((item) => {
    bulkOp.find({
      'station.id' : +item.station.id
    })
    .upsert()
    .update({
      $set : {
        name     : item.station.name,
        station  : item.station,
        region   : item.region,
        city     : item.city,
        settings : item.settings,
        location : item.location
      }
    })
  })
  let result = await bulkOp.execute()
  console.log(result)
}

setTimeout(() => {
  insertData()
}, 5000)

/*
Estación original:
{ "_id" : ObjectId("5ae9cbabbdbda71ad0d8bf7c"), "updatedAt" : ISODate("2018-05-02T14:33:15.587Z"), "createdAt" : ISODate("2018-05-02T14:31:07.922Z"), "name" : "Cauquenes", "settings" : { "autobackup" : true }, "city" : { "id" : 127, "name" : "Cauquenes" }, "region" : { "id" : 9, "name" : "Maule" }, "station" : { "id" : 164, "name" : "Cauquenes" }, "__v" : 0 }
*/
