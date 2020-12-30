class Widget {
  constructor() {
     this.init();
  }


  init() {
    this.submitButton = document.querySelector('.add-record__submit');
    document.querySelector('.add-record').addEventListener('submit', (e) => {
      e.preventDefault();
      const queryStringInput = document.querySelector('#queryStringInput');
      const nameInput = document.querySelector('#nameInput');
      const recordData = {name : nameInput.value, queryString : queryStringInput.value, id : new Date().toISOString()};
        buildfire.deeplink.registerDeeplink(recordData, (err, result) => {
          if(err) return console.log(err);
          console.log('INSERT DEEPLINKT', result);
          this.records.push(result);
          this.renderRecords();
        })
    })

    buildfire.deeplink.getAllDeeplinks({}, (err, res) => {
      if(err) return console.log(err);
      if(res) {
        console.log(res);
        this.records = res;
        this.renderRecords()
      }
    });


    document.querySelector('.list-view').addEventListener('click', ({target}) => {
      const targetId = target.dataset.recordId
      if(target && target.dataset && targetId) {
        if(targetId) {
          buildfire.deeplink.unregisterDeeplink(targetId, (err, result) => {
            if(err) return console.log(err);
            console.log('DELETING DEEPLINK', result);
            this.records = this.records.filter(rec => rec.data.id !== targetId);
            this.renderRecords()
          });
        }
       
      }
    }) 
  }


  renderRecords() {
    const listView = document.querySelector('.list-view');
    listView.innerHTML = '';
    this.records.forEach(rec => {
      const recordMarkup = `<div class="record" >
      <span class="record__name" >name : ${rec.data.name}</span>
      <span class="record__name" >queryString : ${rec.data.queryString}</span>
      <div class="record__actions" >
      <span class="record__delete"  data-record-id="${rec.data.id}" >X</span>
      </div>
      </div>`;
      listView.innerHTML += recordMarkup;
    })

  }
}

