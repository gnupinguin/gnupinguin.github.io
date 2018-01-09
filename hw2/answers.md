Answers
========================

## Question 1.1
Looking at the page containing the table, what are the differences between the DOM as shown by the DOM inspector and the HTML source code? 
Why would you use the DOM inspector? When is the HTML source useful?
###  Answer
DOM reflects the really existing elements that can be dynamically generated using the javascript.
The HTML source code is preferable when you only need to view the general layout of the page.
The DOM inspector is preferable when you need to look at all the objects of the document's structure.

## Question 1.2
Below we have partially reproduced the first lines from the table's dataset. 
What piece of software generates this table? Where are the original data stored?
### Answer
Function d3.json load this data and generate table dynamically(using function `tablePerfomance` in my case). 
Data stored in Json file.

## Question 2.1
You've created filters by continents, which are a limited set of categorical data.
Would you filter other columns from the table the same way? E.g. would you use checkboxes or any other HTML widget?
###  Answer
We could have broken values for other fields into segments (for example, populations)

## Question 3.1
You've aggregated countries by continents, which are (still) a limited set of categorical data.
Could you aggregate the table using other columns? 
If you think yes, explain which ones and how you would group values. Which HTML widgets would be appropriate?
###  Answer
I think  it is impossible with current data structure and performance.

## Question 4.1 
Use this dataset countries_1995_2012.json as input for the previously created table.
What does the new attribute years hold?
### Answer
Now it contains array with information about trade for each year

## Question 5.1 
What are the pros and cons of using HTML vs. SVG? 
Give some examples in the context of creating visualizations.
### Answer
SVG is useful format for graphics. HTML is useful format for text data.

## Question 7.1 
Give an example of a situation where visualization is appropriate, following the arguments discussed in lecture and in the textbook (the example cannot be the same as mentioned in either lecture or textbook).
### Answer
If we want to visualize why first algorithm is better then other

## Question 7.2 
Which limitations of static charts can you solve using interactivity?
### Answer
Extracting additional information for specific data

## Question 7.3 
What are the limitations of visualization?
### Answer
Visualization depends by thinking of concrete people

## Question 7.4 
Why are data semantics important for data?
### Answer
It is allow to select the more important features of data.

## Question 7.5 
Which relationships are defined for two attributes of (a) quantitative, (b) categorical, or (c) ordinal scale?
### Answer
Correlation, level of abstraction, sequence.

## Question 7.6 
Which visual variables are associative (i.e., allow grouping)?
### Answer
Shape, hue, orientation

## Question 7.7 
Which visual variables are quantitative (i.e., allow to judge a quantitative difference between two data points)?
### Answer
Position, size, lightness


