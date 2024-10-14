package tech.buildrun.springPonto.controller.dto;



//oq recebemos da request
//usa o record para criar classes que somente vao receber ou eviar dados
//no caso como e uma response  vai ta enviando os dados
//vai tar enviando o token e sua data de expiration
//pos ele ja criar por de baixo dos panos os geters e setter do username e password
public record LoginResponse(String acessToken, int expiressIn, String response){

    
 
}
