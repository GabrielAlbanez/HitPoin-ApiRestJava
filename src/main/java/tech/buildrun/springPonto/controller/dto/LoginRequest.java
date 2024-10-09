package tech.buildrun.springPonto.controller.dto;


//oq recebemos da request
//usa o record para criar classes que somente vao receber ou eviar dados
//no caso como e uma request vai ta rebendo dados
//pos ele ja criar por de baixo dos panos os geters e setter do username e password
public record LoginRequest(String username, String password){
 
}
