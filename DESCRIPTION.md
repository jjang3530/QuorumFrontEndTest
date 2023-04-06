# Technical Write-Up

Write a couple of paragraphs in here describing how you solved the problem, what challenges you encountered along the way, and how you overcame them.

I started the project by cloning and initializing it, which involved installing npm and enabling the legacy OpenSSL provider. I also had to fix module errors that were caused by differences in the Angular version.

Afterwards, I created a service to handle data from the API and wrote test cases for it. I also created a UI template and test cases for the leads-list component. To display the leads in the table, I used the Material UI and fetched the data from the GET /api/leads endpoint.

However, I encountered an issue when trying to display potential duplicates associated with each lead. The API endpoint GET /api/leads/:lead_id/potential-duplicates did not return the expected data, so I was unable to display the duplicates in the table. To overcome this, I decided to store the potential duplicates as an array and display them in the table using the lead ID.

Total working time was 4 hours. I started on April 5th at 8pm and finished at midnight when time was up.