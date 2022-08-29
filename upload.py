import PyPDF2

def run():
    with open('example.pdf', 'rb') as pdfFileObj:
        pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
        print('Number of Pages: ',pdfReader.numPages)
        for i in range(pdfReader.numPages):
            pageObj = pdfReader.getPage(i)
            print('----------------------------------------------------')
            print('Page {}:'.format(i+1))
            print(pageObj.extractText())

if __name__ == '__main__':
    run()