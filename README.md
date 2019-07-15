# Microsoft-Code-Task
For this task, you need to create an API server providing HTTP service (denoted as S). Server S should handle the query for information from a table. Please implement the servers satisfying the following requirements. You can choose should be done in one of the following language: C#, Java, Python, JavaScript (node), C/C++. The result of this task should be a ZIP archive containing all related files.

1. The information table contains several columns with free-text contents, as illustrated below:

The column name only be characters or digits (A-Z, a-z, 0-9, case sensitive). But there are no constraint to the value of data.

It is stored in a CSV file (with column header) when the server starts and won’t be updated when the server is running;

2. The query is similar to a Boolean expression targeting to a data row:

o It supports 4 operators: “==” equal, “!=” not equal, “$=” equal (case insensitive), “&=” contain (the query term is a substring of the data cell);

o Each predicate P is defined on a column (C1, C2, or C3) or all columns (*), with an query term (a string wrapped in “"”). For example: “* &= "123"  ” yields true when the value of any column in a row contains “123”.

o A query may contains several predicates which concatenated with “and” or “or”. For example, the following are valid queries:

C1 == "A" or C2 &= "B"
C1 == "Test" and * $= "Prod" and * != "Hidden"

For the any unspecified aspects, you can define them accordingly (for example, how to handle the possible “"” in side of the query term);

3. The result is the set of data rows that the query matches. The format of the data should be CSV with column headers;

4. If the query is malformed, the server should reject query processing and try to point out the issue within the query.
