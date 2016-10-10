import PyPDF2 
import json
import sys

pdfFileObj = open(sys.argv[1], 'rb')
textFile = open(sys.argv[1]+'.json', 'w')
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
num_pages = pdfReader.numPages
currNum = sys.argv[1].split('-')[0:3]
currNum[2]= currNum[2][0:4]
currPhoneNum = ''
for i in currNum:
    currPhoneNum += i
incomingCall = []
outgoingCall = []
incomingSMS = []
outgoingSMS = []
data = {}
myPhone = {}

for x in range(0, num_pages):
    current_page = pdfReader.getPage(x).extractText()
    currentData = current_page.splitlines()
    for idx, i in enumerate(currentData):
        if 'Outgoing' in i or 'Incoming' in i:
            if 'Incoming Call' in i:
                incomingCall.append({'time': currentData[idx+3], 'contact': currentData[idx+1],
                'date': currentData[idx+2], 'duration': currentData[idx+4]})
            elif 'Outgoing Call' in i:
                outgoingCall.append({'time': currentData[idx+3], 'contact': currentData[idx+1],
                'date': currentData[idx+2], 'duration': currentData[idx+4]})
            elif 'Incoming Text' in i:
                incomingSMS.append({'time': currentData[idx+3], 'contact': currentData[idx+1], 
                'date': currentData[idx+2], 'duration': currentData[idx+4]})
            elif 'Outgoing Text' in i:
                outgoingSMS.append({'time': currentData[idx+3], 'contact': currentData[idx+1],
                'date': currentData[idx+2], 'duration': currentData[idx+4]})
data['incomingCall'] = incomingCall
data['outgoingCall'] = outgoingCall
data['incomingSMS'] = incomingSMS
data['outgoingSMS'] = outgoingSMS
#print(json.dumps(data))
myPhone[currPhoneNum] = data
textFile.write(json.dumps(myPhone))
textFile.close()
#print(json.dumps(myPhone))
#{
#    'phoneNumber': {
#
#        'IncomingCall': [{
#            'time': data,
#            'date': data, 
#            'contact': data,
#            'duration': data
#            },
#           {
#            'time': data,
#            'date': data, 
#            'contact': data,
#            'duration': data
#           }],
#
#        'OutgoingCall': [{
#            'timestamp': data,
#            'date': data, 
#            'contact': data,
#            'duration': data
#        }],
#        'IncomingSMS': [{
#            'timestamp': data,
#            'date': data, 
#            'contact': data
#        }],
#        'OutgoingSMS': [{
#            'timestamp': data,
#            'date': data, 
#            'contact': data
#        }]
#    }
#}
