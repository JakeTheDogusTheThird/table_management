function buildTable(data) {
  let table = document.getElementById("dataTable");

  for (let i = 0; i < data.length; i++) {
    let row = `<tr>
                  <td>${data[i].id}</td>
                  <td>${data[i].firstName}</td>
                  <td>${data[i].lastName}</td>
                  <td>${data[i].email}</td>
                  <td>${data[i].phone}</td>
               </tr>`
    table.innerHTML += row;
  }
}


class Person {
  #id
  #firstName
  #lastName
  #email
  #phone
  constructor(id, firstName, lastName, email, phone) {
    this.#id = id;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#email = email;
    this.#phone = phone;
  }

  get id() {
    return this.#id;
  }

  get firstName() {
    return this.#firstName;
  }

  get lastName() {
    return this.#lastName;
  }

  get email() {
    return this.#email;
  }

  get phone() {
    return this.#phone;
  }
}

let person1 = new Person(1, "john", "doe", "john@mail.com", "12321");
let person2 = new Person(2, "ann", "donovan", "adonovan@mail.con", "1232131");
let person3 = new Person(3, "susan", "milei", "smilei@mail.con", "28392");
let person4 = new Person(4, "anton", "chighur", "noOldmen@mail.con", "1239128309");

let persons = [person1, person2, person3, person4];

buildTable(persons);