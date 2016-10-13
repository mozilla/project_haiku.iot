import PyPDF2
import json
import sys
import re
import time
import dateutil.parser
import os

pdfFileObj = open(sys.argv[1], 'rb')

lookupFilename = os.path.dirname(os.path.realpath(__file__)) + '/lookup.json'
lookupFileObj = open(lookupFilename)
lookupData = json.load(lookupFileObj)
numbersToIds = {}
for i in lookupData.keys():
    numbersToIds[lookupData[i]] = i

pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
num_pages = pdfReader.numPages

filename = sys.argv[1]
phoneNumberPattern = re.compile('([\d\-]{10,})')
currPhoneNum = 'unknown'
numberMatch = phoneNumberPattern.search(filename)
if (numberMatch):
    currPhoneNum = numberMatch.group(1)

outFilename = filename.replace(\
    currPhoneNum, \
    numbersToIds[currPhoneNum] if numbersToIds.has_key(currPhoneNum) else 'unknown'\
)

outFilename = numbersToIds[currPhoneNum]+'.json'
#outFilename = os.path.splitext(outFilename)[0]+'.json'
outFileObj = open(outFilename, 'w')

def populateOutput(data):
    incomingCall = []
    outgoingCall = []
    incomingSMS = []
    outgoingSMS = []

    for x in range(0, num_pages):
        current_page = pdfReader.getPage(x).extractText()
        currentData = current_page.splitlines()
        for idx, i in enumerate(currentData):
            # time.strptime(str,fmt='%a %b %d %H:%M:%S %Y')
            if 'Outgoing' in i or 'Incoming' in i:
                dateValue = currentData[idx+2]
                timeValue = currentData[idx+3]
                dateTimeStr = dateutil.parser.parse(dateValue+' '+timeValue).isoformat()
                entry = sanitizeEntry({
                    'time': timeValue,
                    'contact': currentData[idx+1],
                    'date': dateValue,
                    'duration': currentData[idx+4],
                    'datetime': dateTimeStr
                })
                if 'Incoming Call' in i:
                    incomingCall.append(entry)
                elif 'Outgoing Call' in i:
                    outgoingCall.append(entry)
                elif 'Incoming Text' in i:
                    incomingSMS.append(entry)
                elif 'Outgoing Text' in i:
                    outgoingSMS.append(entry)

    data['incomingCall'] = incomingCall
    data['outgoingCall'] = outgoingCall
    data['incomingSMS'] = incomingSMS
    data['outgoingSMS'] = outgoingSMS
    # data['phoneNumber'] = currPhoneNum
    data['deviceId'] = numbersToIds[currPhoneNum] if numberMatch else 'unknown'
    return data

def sanitizeEntry(entry):
    number = entry['contact']
    if numbersToIds.has_key(number):
        entry['contact'] = numbersToIds[number]
    else:
     entry['contact'] = '999-999-9999'
    return entry

data = populateOutput({})

outFileObj.write(json.dumps(data, sort_keys=True, indent=4, separators=(',', ': ')))
outFileObj.close()
# print()
