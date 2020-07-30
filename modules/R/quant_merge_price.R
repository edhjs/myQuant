library(stringr)
library(httr)
library(rvest)
library(stringr)
library(readr)
library("RMySQL")
library(xts)
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


price_list = list()

for (i in 1 : nrow(KOR_ticker)) {
  
  name = KOR_ticker[i, 'code']
  price_list[[i]] =
    read.csv(paste0('./KOR_price/', name,
                    '_price.csv'),row.names = 1) %>%
    as.xts()
}

price_list = do.call(cbind, price_list) %>% na.locf()
colnames(price_list) = KOR_ticker$'code'

# price_list = read.csv('./KOR_price.csv')
head(price_list[, 1:5])
tail(price_list[, 1:5])

write.csv(data.frame(price_list), './KOR_price.csv')