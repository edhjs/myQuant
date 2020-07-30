library("xml2")
library("dplyr")
library("httr")
library("rvest")
library("readxl")
library("tibble")
library("RMySQL")
code_get <- function(market = "KOSPI"){
  kospi <- "http://marketdata.krx.co.kr/contents/COM/GenerateOTP.jspx?name=fileDown&filetype=xls&url=MKD/04/0406/04060100/mkd04060100_01&market_gubun=STK&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&isu_nm=&isu_srt_cd=&sort_type=A&std_ind_cd=&par_pr=&cpta_scl=&sttl_trm=&lst_stk_vl=1&in_lst_stk_vl=&in_lst_stk_vl2=&cpt=1&in_cpt=&in_cpt2=&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&mktpartc_no=&isu_srt_cd=&pagePath=%2Fcontents%2FMKD%2F04%2F0406%2F04060100%2FMKD04060100.jsp"
  kosdaq <- "http://marketdata.krx.co.kr/contents/COM/GenerateOTP.jspx?name=fileDown&filetype=xls&url=MKD/04/0406/04060100/mkd04060100_01&market_gubun=KSQ&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&isu_nm=&isu_srt_cd=&sort_type=A&std_ind_cd=&par_pr=&cpta_scl=&sttl_trm=&lst_stk_vl=1&in_lst_stk_vl=&in_lst_stk_vl2=&cpt=1&in_cpt=&in_cpt2=&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&mktpartc_no=&isu_srt_cd=&pagePath=%2Fcontents%2FMKD%2F04%2F0406%2F04060100%2FMKD04060100.jsp"
  konex <- "http://marketdata.krx.co.kr/contents/COM/GenerateOTP.jspx?name=fileDown&filetype=xls&url=MKD/04/0406/04060100/mkd04060100_04&market_gubun=KNX&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&isu_nm=&isu_srt_cd=&sort_type=A&std_ind_cd=&par_pr=&cpta_scl=&sttl_trm=&lst_stk_vl=1&in_lst_stk_vl=&in_lst_stk_vl2=&cpt=1&in_cpt=&in_cpt2=&isu_cdnm=%EC%A0%84%EC%B2%B4&isu_cd=&mktpartc_no=&isu_srt_cd=&pagePath=%2Fcontents%2FMKD%2F04%2F0406%2F04060100%2FMKD04060100.jsp"

  market <- tolower(market)

  if (market %in% c("kospi","all")) {
    kospi <- market_down(kospi, "KOSPI")
  } else {
    kospi <- tibble::tibble()
  }
  if (market %in% c("kosdaq","all")) {
    kosdaq <- market_down(kosdaq, "KOSDAQ")
  } else {
    kosdaq <- tibble::tibble()
  }
  if (market %in% c("konex","all")) {
    konex <- market_down(konex, "KONEX")
  } else {
    konex <- tibble::tibble()
  }

  dplyr::bind_rows(kospi, kosdaq, konex) %>%
    # dplyr::mutate(market = factor(market)) %>%
    return()

}

market_down <- function(tar, market) {
  xml2::read_html(tar) %>%
    rvest::html_nodes("p") %>%
    rvest::html_text() ->
    keys

  body <- list(code = keys)
  ah <- httr::add_headers(Referer = "http://marketdata.krx.co.kr/mdi")
  tar <- "http://file.krx.co.kr/download.jspx"
  httr::POST(tar, body = body, ah, encode = "form") %>%
    httr::content() %>%
    writeBin("./code.xls")
  tem <- readxl::read_xls("./code.xls")
  file.remove("./code.xls")
  tem <- tem[,c(2,3)]
  names(tem)[c(1,2)] <- c("code", "name")
  tem$market <- market
  return(tem)
}

code <- code_get()
db <-dbConnect(
  MySQL(), 
  host = "mydb.ced42knggxf7.ap-northeast-2.rds.amazonaws.com",
  user = "jaesung",
  password = "ghkdwotjd",
  dbname="mydb"
)
dbSendQuery(db, 'set character set "utf8"')
dbWriteTable(db, "codes", code,append=T, overwrite=F)