package umm3601.todo;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Iterator;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static com.mongodb.client.model.Filters.eq;

/**
 * Controller that manages requests for info about todos.
 */
public class TodoController {

  private final MongoCollection<Document> todoCollection;

  /**
   * Construct a controller for todos.
   *
   * @param database the database containing to-do data
   */
  public TodoController(MongoDatabase database) {
    todoCollection = database.getCollection("todos");
  }

  /**
   * Helper method that gets a single to-do specified by the `id`
   * parameter in the request.
   *
   * @param id the Mongo ID of the desired to-do
   * @return the desired to-do as a JSON object if the to-do with that ID is found,
   * and `null` if no to-do with that ID is found
   */
  public String getTodo(String id) {
    FindIterable<Document> jsonTodos
      = todoCollection
      .find(eq("_id", new ObjectId(id)));
    Iterator<Document> iterator = jsonTodos.iterator();
    if (iterator.hasNext()) {
      Document todo = iterator.next();
      return todo.toJson();
    } else {
      // We didn't find the desired to-do
      return null;
    }
  }


  /**
   * Helper method which iterates through the collection, receiving all
   * documents if no query parameter is specified. If the status query parameter
   * is specified, then the collection is filtered so only documents of that
   * specified status are found.
   *
   * @param queryParams the query parameters from the request
   * @return an array of Todos in a JSON formatted string
   */
  public String getTodos(Map<String, String[]> queryParams) {

    Document filterDoc = new Document();

    if (queryParams.containsKey("status")) {
      boolean targetStatus = Boolean.parseBoolean(queryParams.get("status")[0]);
      filterDoc = filterDoc.append("status", targetStatus);
    }

    if (queryParams.containsKey("body")) {
      String targetContent = (queryParams.get("body")[0]);
      Document contentRegQuery = new Document();
      contentRegQuery.append("$regex", targetContent);
      contentRegQuery.append("$options", "i");
      filterDoc = filterDoc.append("body", contentRegQuery);
    }

    //FindIterable comes from mongo, Document comes from Gson
    FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

    return serializeIterable(matchingTodos);
  }

  /*
   * Take an iterable collection of documents, turn each into JSON string
   * using `document.toJson`, and then join those strings into a single
   * string representing an array of JSON objects.
   */
  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }


  /**
   * Helper method which appends received to-do information to the to-be added document
   *
   * @param owner the owner of the new to-do
   * @param status the status of the new to-do
   * @param body the body the new to-do works for
   * @param category the category of the new to-do
   * @return boolean after successfully or unsuccessfully adding a to-do
   */
  public String addNewTodo(String owner, boolean status, String body, String category) {

    Document newTodo = new Document();
    newTodo.append("owner", owner);
    newTodo.append("status", status);
    newTodo.append("body", body);
    newTodo.append("category", category);

    try {
      todoCollection.insertOne(newTodo);
      ObjectId id = newTodo.getObjectId("_id");
      System.err.println("Successfully added new todo [_id=" + id + ", owner=" + owner + ", status=" + status + " body=" + body + " category=" + category + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
