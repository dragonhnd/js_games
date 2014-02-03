<script>
    var G = {
        fs:[],
        fn:[],
        score:0,
        l:['#9F0','#FF3','#F33','#C0C','#33C','#0F3','#F93'],
        v:[0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0x801,0xFFFF],
        d:[[0xCC00],[0x4444,0xF0],[0x8C40,0x6C00],[0x4C80,0xC600],[0x44C0,0x8E00,0xC880,0xE200],[0x88C0,0xE800,0xC440,0x2E00],[0x4E00,0x8C80,0xE400,0x4C40]],
        init:function(){
            var body = document.getElementById('body');
            var next = document.getElementById('next');
            for(var i=0;i<240;i++){
                G.fs.push(body.appendChild(document.createElement("span")));
            }
            for(var i=0;i<16;i++){
                G.fn.push(next.appendChild(document.createElement("p")));
            }
            G.domScore = document.getElementById('score');
            G.domLevel = document.getElementById('level');
            document.onkeydown=function(e){G.event(e||window.event,0)};
            G.rand();
            G.next();
        },
        timeTesk:function(){
            if(G.pause)return;
            if(!G.move(G.x, G.y+1, G.t)){
                var s = 0;
                for(var i=0;i<19;i++){
                    G.v[i]=G.v[i]|G.m[i];
                    if(G.v[i]==0xFFF){
                        for(var k=i;k>0;k--){
                            G.v[k] = G.v[k-1];
                        }
                        G.score+=++s;
                    }
                }
                G.next();
                return false;
            }
            G.draw();
            return true;
        },
        move:function(x,y,t){
            var m = [];
            for(var k=0;k<4;k++){
                m[y+k] = (G.d[G.n][t]>>(3-k)*4&0xF)<<Math.max(x,0)>>-Math.min(x,0);
                if(m[y+k] & G.v[y+k]){
                    return false;
                }
            }
            G.x = x;
            G.y = y;
            G.t = t;
            G.m = m;
            G.draw();
            return true;
        },
        rand:function(){
            G.n = G._n;
            G.t = G._t;
            G.c = G._c;
            G._n = parseInt(Math.random()*G.d.length);
            G._t = parseInt(Math.random()*G.d[G._n].length);
            G._c = parseInt(Math.random()*G.l.length);
        },
        next:function(){
            G.rand();
            if(parseInt(G.score/20)!=G.level){
                G.level = parseInt(G.score/20);
                clearInterval(G.handle);
                G.handle = setInterval("G.timeTesk()",500/(G.level+1));
            }
            G.domScore.innerHTML = 'Score:'+G.score;
            G.domLevel.innerHTML = 'Level:'+G.level;
            var i = 0;
            while(!(G.d[G.n][G.t]>>i*4&0xF))i++;
            if(!G.move(3, i-3, G.t)){
                alert('Game over!');
                clearInterval(G.handle);
            }
        },
        draw:function(){
            for(var i=0;i<240;i++){
                if((G.v[parseInt(i/12)]>>(11-i%12))&0x1){
                    G.fs[i].style.visibility = '';
                }else if((G.m[parseInt(i/12)]>>(11-i%12))&0x1){
                    G.fs[i].style.visibility = '';
                    G.fs[i].style.borderColor = G.fs[i].style.background = G.l[G.c];
                }else{
                    G.fs[i].style.visibility ='hidden';
                }
            }
            for(var i=0;i<16;i++){
                if(G.d[G._n][G._t]>>(15-i)&0x1){
                    G.fn[i].style.visibility = '';
                    G.fn[i].style.borderColor = G.fn[i].style.background = G.l[G._c];
                }else{
                    G.fn[i].style.visibility ='hidden';
                }
            }
        },
        event:function(e,t){
            switch(e.keyCode){
                case 37:
                    G.move(G.x + 1, G.y, G.t);
                break;
                case 39:
                    G.move(G.x - 1, G.y, G.t);
                break;
                case 38:
                    G.move(G.x, G.y, (G.t + 1) % G.d[G.n].length);
                break;
                case 40:
                    G.timeTesk();
                break;
                case 32:
                    while(G.timeTesk());
            }
        }
    }
</script>