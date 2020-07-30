library(stringr)
library(httr)
library(rvest)
library(readr)
library("RMySQL")
library(xts)
library(magrittr)
library(dplyr)
db <-dbConnect(
  MySQL(), 
  host = "mydb.ced42knggxf7.ap-northeast-2.rds.amazonaws.com",
  user = "jaesung",
  password = "ghkdwotjd",
  dbname="mydb"
)
dbSendQuery(db, 'set character set "utf8"')

KOR_ticker <- dbGetQuery(
  db,
  "SELECT `code`,`name` FROM `codes`;"
)


data_value = list()

for (i in 1 : nrow(KOR_ticker)){
  
  name = KOR_ticker[i, 'code']
  data_value[[i]] =
    read.csv(paste0('./KOR_value/', name,
                    '_value.csv'), row.names = 1) %>%
    t() %>% data.frame()

}
# knitr::kable(
#   data.frame(
#     'value' = c('PER', 'PBR', 'PCR', 'PSR'),
#     'x' = c('Number 1', 'Number 2', 'Number 3', 'Number 4')),
#   booktabs = TRUE,
#   align = "c",
#   caption = '가치지표의 저장 예시'
# ) %>%
#   kableExtra::kable_styling(latex_options = c("striped", "hold_position")) %>%
#   kableExtra::column_spec(1, width = "3cm") %>%
#   kableExtra::column_spec(2, width = "5cm")

  data_value = bind_rows(data_value)
print(head(data_value))
data_value = data_value[colnames(data_value) %in%
                          c('PER', 'PBR', 'PCR', 'PSR')]

data_value = data_value %>%
  mutate_all(list(~na_if(., Inf)))

rownames(data_value) = KOR_ticker[, 'code']
print(head(data_value))
write.csv(data_value, './KOR_value.csv')