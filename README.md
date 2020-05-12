## takeaway
  - 外卖系统

## 在 chrome 的的控制台获取页面数据
  $$('._9a091c9-main_3xXjbMn').map((li,i) => {  
    return {  
      name:$$('._9a091c9-shopName_3x808Xd > span')[i].innerText,   
      scope_sell: $$('._9a091c9-rateWrap_3IRG8tk')[i].innerText,   
      delivery: $$('._9a091c9-moneyLimit_2eok2-i')[i].innerText,   
      time_distance: $$('._9a091c9-timedistanceWrap_1CMzP7H')[i].innerText,   
      img: $$('._9a091c9-main_2vA93DT')[i].src  
      }  
    }  
  )  
