#!/bin/bash

# Get People List (GET)
curl -u coffe:kafe "http://ajax1.lmsoft.cz/procedure.php?cmd=getPeopleList"

# Get Types List (GET)
curl -u coffe:kafe "http://ajax1.lmsoft.cz/procedure.php?cmd=getTypesList"

# Get Summary of Drinks (GET)
curl -u coffe:kafe "http://ajax1.lmsoft.cz/procedure.php?cmd=getSummaryOfDrinks"

curl -u coffe:kafe -d "user=3&type[1]=2&type[2]=4&type[3]=3&type[4]=4&type[5]=4" -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" "http://ajax1.lmsoft.cz/procedure.php?cmd=saveDrinks"

# POST request
curl -X POST -u coffe:kafe "http://ajax1.lmsoft.cz/"
