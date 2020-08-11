import json
import csv

latitude = []
longtitude = []
geo_data = []
with open('./data_log.csv') as data_log:
    reader = csv.reader(data_log, delimiter=',')
    
    for row in reader:
        longtitude.append(row[0])
        latitude.append(row[1])

latitude.remove("latitude")
longtitude.remove("longtitude")

for i in range(len(latitude)):
    temp = {
        str("lat"): float(latitude[i]),
        str("lng"): float(longtitude[i])
    }   

    geo_data.append(temp)


geo_data_json = json.dumps(geo_data)



print(geo_data_json)

with open("data_log.json", "w") as outfile:
    json.dump(geo_data, outfile)



latitude = []
longtitude = []
time = []
geo_data = []
with open('./violation.csv') as data_log:
    reader = csv.reader(data_log, delimiter=',')
    
    for row in reader:
        longtitude.append(row[0])
        latitude.append(row[1])
        time.append(row[2])

latitude.remove("latitude")
longtitude.remove("longtitude")
time.remove("time")

for i in range(len(latitude)):
    temp = {
        str("lat"): float(latitude[i]),
        str("lng"): float(longtitude[i]),
        str("time"): int(time[i])
    }   

    geo_data.append(temp)


geo_data_json = json.dumps(geo_data)



print(geo_data_json)

with open("violation.json", "w") as outfile:
    json.dump(geo_data, outfile)
        