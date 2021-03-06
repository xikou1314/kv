class Watcher {
  constructor(data) {
    this.$data = data;
    this.mountWatcher();
  }

  mountWatcher() {
    let od = this.$data._od_;

    for (let key in this.$data) {
      (function(key) {
        let timeoutHandler = null;

        if (key !== '_od_' && !od[key].mounted) {
          if (!od[key]) {
            throw new Error(`data: ${key} is init`);
          }
          Object.defineProperty(this.$data, key, {
            get() {
              return od[key].value;
            },
            set(value) {
              clearTimeout(timeoutHandler);
              timeoutHandler = setTimeout(() => {
                if (value !== od[key].value) {
                  var $n = od[key].linkNodes;
                  od[key].value = value;
                  for (var i = 0, n; n = $n[i]; i++) {
                    n.update();
                  }
                }
              }, 1000 / 60);
            }
          });
          od[key].mounted = true;
        }

      }.bind(this))(key);
    }
  }

  linkNode($node) {
    for (let i = 0, n; n = $node.$args[i]; i++) {
      if (this.$data[n] && this.$data._od_[n] && this.$data._od_[n].linkNodes.indexOf($node) === -1) {
        this.$data._od_[n].linkNodes.push($node);
      }
    }
  }

  updateData() {
    
  }
}

export default Watcher;