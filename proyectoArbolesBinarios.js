class NodoArbol{
    constructor(dato){
        this.dato = dato;
        this.izq = null;
        this.der = null;
    }
}

class NodoPila{
    constructor(valor){
        this.valor = valor;
        this.next = null;
    }
}

class PilaArbolExp{
    constructor(tope){
        this.tope = tope;
    }

    insertar(nuevo){
        let n = new NodoPila(nuevo);
        n.next = this.tope;
        this.tope = n;
    }

    pilaVacia(){
        return this.tope == null;
    }

    topePila(){
        return this.tope.valor;
    }

    reiniciarPila(){
        this.tope = null;
    }

    quitar(){
        let aux = null;
        if(!this.pilaVacia()){
            aux = this.tope.valor;
            this.tope = this.tope.next;
        }
        return aux;
    }
}

class ArbolBinarioExp{
    constructor(){
        this.raiz;
    }

    arbolBinarioExp(cadena){
        this.raiz = this.crearArbolBE(cadena);
    }

    reiniciaArbol(){
        this.raiz = null;
    }

    crearNodo(dato){
        this.raiz = new NodoArbol(dato);
    }

    crearSubArbol(dato1, dato2, operador){
        operador.izq = dato1;
        operador.der = dato2;
        return operador;
    }

    arbolVacio(){
        return this.raiz == null;
    }

    preOrder(arbol, c){
        let s = "";
        if (arbol != null){
            s = c + toString(arbol.dato) + "" + this.preOrder(arbol.izq, c) + this.preOrder(arbol.der, c);
        }
        return s;
    }

    postOrder(arbol, c){
        let s = "";
        if (arbol != null){
            s = c + this.postOrder(arbol.izq, c) + this.postOrder(arbol.der, c) + toString(arbol.dato) + "";
        }
        return s;
    }

    imprimirArbol(a){
        let x = "";
        switch(a){
            case 1:
                x = this.preOrder(this.raiz, x);
                break;
            case 2:
                x = this.postOrder(this.raiz, x);
                break;
        }
        return x;
    }

    prioridad(x){
        let p = 100;
        switch(x){
            case '*':
            case '/':
                p = 20;
                break;
            case '+':
            case '-':
                p = 10;
                break;
            default:
                p = 0;
        }
        return p;
    }

    esOperador(x){
        let res;
        switch(x){
            case '*':
            case '/':
            case '+':
            case '-':
                res = true;
            default:
                res = false;
        }
        return res;
    }

    crearArbolBE(cadena){
        let pilaOperadores = new PilaArbolExp();
        let pilaExpresiones = new PilaArbolExp();
        let token;
        let op1 = new NodoArbol;
        let op2 = new NodoArbol;
        let op = new NodoArbol;
        let caracterEvaluado;
        for (let i = 0; i < cadena.length; i++) {
            caracterEvaluado = cadena.charAt(i);
            token = new NodoArbol(caracterEvaluado);
            if(!this.esOperador(caracterEvaluado)){
                pilaExpresiones.insertar(token);
            } else {
                while(!pilaOperadores.pilaVacia() && this.prioridad(caracterEvaluado) <= this.prioridad(toString(pilaOperadores.topePila().dato).charAt(0))){
                    op2 = pilaExpresiones.quitar();
                    op1 = pilaExpresiones.quitar();
                    op = pilaExpresiones.quitar();
                    op = this.crearSubArbol(op2, op1, op);
                    pilaExpresiones.insertar(op);
                }
                pilaOperadores.insertar(token);
            }
        }
        while(!pilaOperadores.pilaVacia()){
            op2 = pilaExpresiones.quitar();
            op1 = pilaExpresiones.quitar();
            op = pilaExpresiones.quitar();
            op = this.crearSubArbol(op2, op1, op);
            pilaExpresiones.insertar(op);
        }
        op = pilaExpresiones.quitar();
        return op;
    }

    evaluaExpresion(){
        return this.evalua(this.raiz);
    }

    evalua(nodo){
        let acum = 0;
        if(!this.esOperador(toString(nodo.dato).charAt(0))){
            return double.parseDouble(toString(nodo.dato));
        } else {
            switch(toString(nodo.dato).charAt(0)){
                case '*':
                    acum = acum + this.evalua(nodo.izq) * this.evalua(nodo.der);
                    break;
                case '/':
                    acum = acum + this.evalua(nodo.izq) / this.evalua(nodo.der);
                    break;
                case '+':
                    acum = acum + this.evalua(nodo.izq) + this.evalua(nodo.der);
                    break;
                case '-':
                    acum = acum + this.evalua(nodo.izq) - this.evalua(nodo.der);
                    break;
            }
        }
        return acum;
    }
}

let expresion = '5*3-5';
let arbol = new ArbolBinarioExp();
arbol.arbolBinarioExp(expresion);
console.log(arbol.imprimirArbol(1));
console.log(arbol.imprimirArbol(2));
console.log(arbol.evaluaExpresion());