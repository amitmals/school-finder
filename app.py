#Dependencies
from flask import Flask, render_template, jsonify
import requests
import json
from bson import json_util
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
import time
import pandas as pd
import numpy as np

#Local dependencies
from config import api_key

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/college_app"
mongo = PyMongo(app)

# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/compare2")
def compare2():
    return render_template("compare2.html")

@app.route("/about")
def about():
    return render_template("about.html")

def toJson(data):
    """Convert Mongo object(s) to JSON"""
    return json.dumps(data, default=json_util.default)

@app.route("/schools")
def schools():

    # URL for GET requests to retrieve school data
    base_url = "https://api.data.gov/ed/collegescorecard/v1/schools?api_key=" + api_key
    # Filter by State
    # ST = "&school.state=CA"
    min_size = "&latest.student.size__range=15000.."
    filter_url = base_url + min_size
    # filter_url = base_url + ST + min_size
    # filter_url = base_url

    #Get total results count
    response = requests.get(filter_url).json()
    time.sleep(10)
    print("pause for 10 seconds for results counter")
    school_responses = response['metadata']['total']
    max_pages = 20
    pages = int(np.ceil(school_responses / max_pages))
    print("Number of Calls Needed to Paginate")
    print(pages)    

    def api_call(page):
    
        school_data = []

        url = filter_url + f"&_page={page}"
        data = requests.get(url).json()

        for i in range(len(data["results"])):
            s_id = data["results"][i]["id"]
            
            #SCHOOL DATA
            school_name = data["results"][i]["school"]["name"]
            url = data["results"][i]["school"]["school_url"]
            city = data["results"][i]["school"]['city']
            state = data["results"][i]["school"]['state']
            zip_code = data["results"][i]["school"]['zip']
            lon = data["results"][i]["location"]["lon"]
            lat = data["results"][i]["location"]["lat"]
            ft_faculty_rate = data["results"][i]["school"]['ft_faculty_rate']
            locale = data["results"][i]["school"]['locale']
            title_iv_eligibility = data["results"][i]["school"]['title_iv']['eligibility_type']
            highest_degree = data["results"][i]["school"]['degrees_awarded']['highest']
            ownership = data["results"][i]["school"]['ownership']    
            
            ##GRAD RATE AND EARNINGS
            completion_rate = data["results"][i]["latest"]["completion"]["rate_suppressed"]["overall"]
            earnings_mean = data["results"][i]["latest"]["earnings"]["9_yrs_after_entry"]["mean_earnings"]
            earning_over_25k = data["results"][i]["latest"]["earnings"]["9_yrs_after_entry"]["percent_greater_than_25000"]
            
            ##COST
            cost_attendance = data["results"][i]["latest"]["cost"]["attendance"]["academic_year"]
            tuition_in_state = data["results"][i]["latest"]["cost"]["tuition"]["in_state"]
            tuition_out_of_state = data["results"][i]["latest"]["cost"]["tuition"]["out_of_state"]
            
            ##DEMOGRAPHICS
            size = data["results"][i]["latest"]["student"]["size"]
            black = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["black"]
            asian = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["asian"]
            white = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["white"]
            hispanic = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["hispanic"]
            asian_pacific_islander = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["asian_pacific_islander"]
            unknown = data["results"][i]["latest"]["student"]["demographics"]["race_ethnicity"]["unknown"]
            women = data["results"][i]["latest"]["student"]["demographics"]["women"]
            men = data["results"][i]["latest"]["student"]["demographics"]["men"]
            
            ##PROGRAMS
            education = data["results"][i]["latest"]["academics"]["program_percentage"]["education"]
            business_marketing = data["results"][i]["latest"]["academics"]["program_percentage"]["business_marketing"]
            mathematics = data["results"][i]["latest"]["academics"]["program_percentage"]["mathematics"]
            communications_technology = data["results"][i]["latest"]["academics"]["program_percentage"]["communications_technology"]
            language = data["results"][i]["latest"]["academics"]["program_percentage"]["language"]
            visual_performing = data["results"][i]["latest"]["academics"]["program_percentage"]["visual_performing"]
            engineering_technology = data["results"][i]["latest"]["academics"]["program_percentage"]["engineering_technology"]
            parks_recreation_fitness = data["results"][i]["latest"]["academics"]["program_percentage"]["parks_recreation_fitness"]
            agriculture = data["results"][i]["latest"]["academics"]["program_percentage"]["agriculture"]
            security_law_enforcement = data["results"][i]["latest"]["academics"]["program_percentage"]["security_law_enforcement"]
            computer = data["results"][i]["latest"]["academics"]["program_percentage"]["computer"]
            precision_production = data["results"][i]["latest"]["academics"]["program_percentage"]["precision_production"]
            humanities = data["results"][i]["latest"]["academics"]["program_percentage"]["humanities"]
            library = data["results"][i]["latest"]["academics"]["program_percentage"]["library"]
            psychology = data["results"][i]["latest"]["academics"]["program_percentage"]["psychology"]
            social_science = data["results"][i]["latest"]["academics"]["program_percentage"]["social_science"]
            legal = data["results"][i]["latest"]["academics"]["program_percentage"]["legal"]                    
            english = data["results"][i]["latest"]["academics"]["program_percentage"]["english"]
            construction = data["results"][i]["latest"]["academics"]["program_percentage"]["construction"]
            military = data["results"][i]["latest"]["academics"]["program_percentage"]["military"]
            communication = data["results"][i]["latest"]["academics"]["program_percentage"]["communication"]
            public_administration_social_service = data["results"][i]["latest"]["academics"]["program_percentage"]["public_administration_social_service"]
            architecture = data["results"][i]["latest"]["academics"]["program_percentage"]["architecture"]
            ethnic_cultural_gender = data["results"][i]["latest"]["academics"]["program_percentage"]["ethnic_cultural_gender"]
            resources = data["results"][i]["latest"]["academics"]["program_percentage"]["resources"]
            health = data["results"][i]["latest"]["academics"]["program_percentage"]['health']
            engineering = data["results"][i]["latest"]["academics"]["program_percentage"]['engineering']
            history = data["results"][i]["latest"]["academics"]["program_percentage"]['history']
            theology_religious_vocation = data["results"][i]["latest"]["academics"]["program_percentage"]['theology_religious_vocation']
            transportation = data["results"][i]["latest"]["academics"]["program_percentage"]['transportation']
            physical_science = data ["results"][i]["latest"]["academics"]["program_percentage"]['physical_science']
            science_technology = data["results"][i]["latest"]["academics"]["program_percentage"]['science_technology']
            biological = data["results"][i]["latest"]["academics"]["program_percentage"]['biological']
            family_consumer_science = data["results"][i]["latest"]["academics"]["program_percentage"]['family_consumer_science']
            philosophy_religious = data["results"][i]["latest"]["academics"]["program_percentage"]['philosophy_religious']
            personal_culinary = data["results"][i]["latest"]["academics"]["program_percentage"]['personal_culinary']
            multidiscipline = data["results"][i]["latest"]["academics"]["program_percentage"]['multidiscipline']
            mechanic_repair_technology = data["results"][i]["latest"]["academics"]["program_percentage"]['mechanic_repair_technology']
            
            ##ADMISSIONS
            avg_sat = data["results"][i]["latest"]["admissions"]['sat_scores']['average']['overall']
            mid_act = data["results"][i]["latest"]["admissions"]['act_scores']['midpoint']['cumulative']
            admission_rate = data["results"][i]["latest"]["admissions"]['admission_rate']['overall']
            
            ##DEBT
            students_with_any_loan = data["results"][i]["latest"]["aid"]['students_with_any_loan']
            median_debt = data["results"][i]["latest"]["aid"]['median_debt_suppressed']['overall']
            default_rate = data["results"][i]["latest"]["repayment"]['3_yr_default_rate']

            school_data.append({"ID": s_id,
                                "Name": school_name,
                                "Website": url,
                                "City": city,
                                "State": state,
                                "Zip": zip_code,
                                "Longitude": lon,
                                "Latitude": lat,
                                "Faculty Rate": ft_faculty_rate,
                                "Locale": locale,
                                "Title IV": title_iv_eligibility,
                                "Highest Degree": highest_degree,
                                "Ownership": ownership,
                                "Completion Rate": completion_rate,
                                "Pct Earning > $25K": earning_over_25k,
                                "Avg Earnings (9yrs)": earnings_mean,
                                "Cost Attendance": cost_attendance,
                                "In State Tuition": tuition_in_state,
                                "Out-of-State Tuition": tuition_out_of_state,
                                "Total Students": size,
                                "Black": black,
                                "Asian": asian,
                                "White": white,
                                "Hispanic": hispanic,
                                "Islander": asian_pacific_islander,
                                "Unknown": unknown,
                                "Women": women,
                                "Men": men,
                                "education": education,
                                "mathematics": mathematics,
                                "business_marketing": business_marketing,
                                "communications_technology": communications_technology,
                                "language": language,
                                "visual_performing": visual_performing,
                                "engineering_technology": engineering_technology,
                                "parks_recreation_fitness": parks_recreation_fitness,
                                "agriculture": agriculture,
                                "security_law_enforcement": security_law_enforcement,
                                "computer": computer,
                                "precision_production": precision_production,
                                "humanities": humanities,
                                "library": library,
                                "psychology": psychology,
                                "social_science": social_science,
                                "legal": legal,
                                "english": english,
                                "construction": construction,
                                "military": military,
                                "communication": communication,
                                "public_administration_social_service": public_administration_social_service,
                                "architecture": architecture,
                                "ethnic_cultural_gender": ethnic_cultural_gender,
                                "resources": resources,
                                "health": health,
                                "engineering": engineering,
                                "history": history,
                                "theology_religious_vocation": theology_religious_vocation,
                                "transportation": transportation,
                                "physical_science": physical_science,
                                "science_technology": science_technology,
                                "biological": biological,
                                "family_consumer_science": family_consumer_science,
                                "philosophy_religious": philosophy_religious,
                                "personal_culinary": personal_culinary,
                                "multidiscipline": multidiscipline,
                                "mechanic_repair_technology": mechanic_repair_technology,
                                "Avg SAT": avg_sat,
                                "Mid ACT": mid_act,
                                "Admission Rate": admission_rate,
                                "Pct Students with Loan": students_with_any_loan,
                                "Median Debt": median_debt,
                                "Default Rate": default_rate,
                            })
        return(school_data)


    # Clear out collection, Paginate API, Insert into MongoDB collection
    collection = mongo.db.items
    collection.remove()

    for page_iteration in range(pages):
        college_data = api_call(page_iteration)
        print("page -----------------------------------------")
        print(page_iteration)
        print("loading...")
        collection.insert_many(college_data)
        print("LOADED!")
    
    return "API CALLS COMPLETE"




@app.route("/coldata")
def coldata():
    results = mongo.db.items.find()
    all_data = [result for result in results]
    return toJson(all_data)

if __name__ == "__main__":
    app.run(debug=True)

