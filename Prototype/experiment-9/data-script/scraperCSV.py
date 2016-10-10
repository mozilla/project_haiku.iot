import PyPDF2 
import sys

pdfFileObj = open(sys.argv[1], 'rb')
textFile = open(sys.argv[1]+'.csv', 'w')
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
num_pages = pdfReader.numPages
data = []

for x in range(0, num_pages):
    current_page = pdfReader.getPage(x).extractText()
    currentData = current_page.splitlines()
    for idx, i in enumerate(currentData):
        if 'Outgoing' in i or 'Incoming' in i:
            data.append(currentData[idx]+',')
            data.append(currentData[idx+1]+',')
            data.append(currentData[idx+2]+',')
            data.append(currentData[idx+3]+',')
            data.append(currentData[idx+4]+',')
            data.append(currentData[idx+5])
            data.append('\n')
        
for i in data:
    textFile.write(i)           
textFile.close()
