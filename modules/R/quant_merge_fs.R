library(stringr)
library(httr)
library(rvest)
library(stringr)
library(readr)
library("RMySQL")
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

data_fs = list()
for (i in 1 : nrow(KOR_ticker)){
  
  name = KOR_ticker[i, 'code']
  data_fs[[i]] = read.csv(paste0('./KOR_fs/', name,
                                 '_fs.csv'), row.names = 1)
}
# saveRDS(data_fs, './data_fs.Rds')
# data_fs = readRDS('./data_fs.Rds')
fs_item = data_fs[[1]] %>% rownames()
length(fs_item)
print(head(fs_item))
select_fs = lapply(data_fs, function(x) {
    # 해당 항목이 있을시 데이터를 선택
    if ( '매출액' %in% rownames(x) ) {
          x[which(rownames(x) == '매출액'), ]
      
    # 해당 항목이 존재하지 않을 시, NA로 된 데이터프레임 생성
      } else {
      data.frame(NA)
    }
  })

select_fs = bind_rows(select_fs)

print(head(select_fs))
select_fs = select_fs[!colnames(select_fs) %in%
                        c('.', 'NA.')]
select_fs = select_fs[, order(names(select_fs))]
rownames(select_fs) = KOR_ticker[, 'code']

print(head(select_fs))
fs_list = list()

for (i in 1 : length(fs_item)) {
  select_fs = lapply(data_fs, function(x) {
    # 해당 항목이 있을시 데이터를 선택
    if ( fs_item[i] %in% rownames(x) ) {
          x[which(rownames(x) == fs_item[i]), ]
      
    # 해당 항목이 존재하지 않을 시, NA로 된 데이터프레임 생성
      } else {
      data.frame(NA)
    }
  })

  # 리스트 데이터를 행으로 묶어줌 
  select_fs = bind_rows(select_fs)

  # 열이름이 '.' 혹은 'NA.'인 지점은 삭제 (NA 데이터)
  select_fs = select_fs[!colnames(select_fs) %in%
                          c('.', 'NA.')]
  
  # 연도 순별로 정리
  select_fs = select_fs[, order(names(select_fs))]
  
  # 행이름을 티커로 변경
  rownames(select_fs) = KOR_ticker[, 'code']
  
  # 리스트에 최종 저장
  fs_list[[i]] = select_fs

}

# 리스트 이름을 재무 항목으로 변경
names(fs_list) = fs_item
saveRDS(fs_list, './KOR_fs.Rds')